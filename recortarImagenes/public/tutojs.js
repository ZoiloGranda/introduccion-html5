var clsCut = (function() {
  var rect;

  function letsCut(cutBtn, endBtn, idImg, idContainer) {
    //esto es para usarlo mas facil con jquery
    cutBtn = '#' + cutBtn;
    endBtn = '#' + endBtn;
    idImg = '#' + idImg;
    //cuando se hace click en el boton de iniciar corte, se oculta
    $(cutBtn).fadeOut();
    //y se muestra el boton de terminar corte
    $(endBtn).fadeIn();
    //y tambien oculta la imagen original para poder trabajar en el canvas
    $(idImg).fadeOut();
    //se obtiene la ruta de la imagen
    var url = $(idImg).attr('src');
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    //cuando la imagen se termine de cargar, se ejecuta la funcion
    img.onload = function() {
      var imgWidth = this.width;
      var imgHeight = this.height;
      //libreria de kinetics
      var stage = new Kinetic.Stage({
        //el id del contenedor de html donde va a estar el canvas
        container: idContainer,
        //alto y ancho del canvas creado con kinect
        width: imgWidth,
        height: imgHeight
      })
      //se crea capa sobre el stage
      var layer = new Kinetic.Layer();
      //se carga una imagen en el canvas
      var image = new Kinetic.Image({
        //x y para la posicioj inicial de la imagen
        x: 0,
        y: 0,
        //image la imagen que se va a cargar en el canvas, es this, porque estamos en la function del onload de img
        image: this
      });
      //se añade la imagen a la capa (layer)
      layer.add(image);
      //se añade el layer el escenario
      stage.add(layer);
      drawCircles(stage, layer, cutBtn, endBtn);
    }
  }

  function drawCircles(stage, layer, cutBtn, endBtn) {
    var imgW, imgH;
    var circle = new Kinetic.Circle({
      //x y es donde se empieza a dibujar el circulo
      x: 20,
      y: 20,
      radius: 20,
      fill: 'black',
      stroke: 'white',
      strokeWidth: 2,
      draggable: true
    })
    var circle4 = new Kinetic.Circle({
      //x y es donde se empieza a dibujar el circulo
      x: stage.getWidth() - 20,
      y: stage.getHeight() - 20,
      radius: 20,
      fill: 'black',
      stroke: 'white',
      strokeWidth: 2,
      draggable: true
    })
    var shapes = [circle, circle4];
    //este rect es el rectangulo de la seleccion entre los dos circles
    if (!rect) {
      //este rect va a tener el ancho y alto que haya entre los dos circles
      imgW = shapes[0].getX() - shapes[1].getX;
      imgH = shapes[0].getY() - shapes[1].getY;
      rect = new Kinetic.Rect({
          x: shapes[0].getX(),
          y: shapes[0].getY(),
          //los circulos tienen radio, los rectangulos tiene ancho y alto
          width: -imgW,
          height: -imgH,
          //el ultimo numero es la opacidad
          fill: 'rgba(0,250,0,0.5)'
        })
        //se añade el rect a la capa
      layer.add(rect);
      //se dibujan las formas en el layer
      layer.draw();
    }
    for (var i = 0; i < shapes.length; i++) {
      //on para poner un listener
      //dragend para que el listener sea cuando el usuario de arrastrar un circulo
      shapes[i].on('dragend', function() {
        if (rect) {
          //cuando el usuario deja de arrastrar el rectangulo, se elimina
          layer.remove(rect);
        }
        imgW = shapes[0].getX() - shapes[1].getX();
        imgH = shapes[0].getY() - shapes[1].getY();
        rect = new Kinetic.Rect({
            x: shapes[0].getX(),
            y: shapes[0].getY(),
            //los circulos tienen radio, los rectangulos tiene ancho y alto
            width: -imgW,
            height: -imgH,
            //el ultimo numero es la opacidad
            fill: 'rgba(0,250,0,0.5)'
          })
          //se añade el rect a la capa
        layer.add(rect);
        //se dibujan las formas en el layer
        layer.draw();
      })
    }
    //listener cuando se hace click en el boton de terminar recorte (endBtn)
    $(endBtn).on('click', function(){
    	//se eliminan las figuras del layer
    	layer.remove(circle);
    	layer.remove(circle4);
    	layer.remove(rect);
    	layer.draw();
    	//kinetic crea varios canvas al mismo tiempo, aunque solo muestre uno
    	//aqui se guarda en la variable micanvas, un arreglo de todos los elementos canvas del html
    	var miCanvas = document.getElementsByTagName('canvas');
    	//micanvas[2] es el canvas que se muestra
      //al obtener el contexto, permite obtener la infomacion del canvas, y asi obtener la imagen recortada
    	var ctx = miCanvas[2].getContext('2d');
    	var datosDeLaImagen=ctx.getImageData(rect.getX(), rect.getY(),-imgW,-imgH)
    	//este es el canvas donde se va a mostrar la imagen ya recortada
    	var canvasFinal = miCanvas[3];
    	var ctx2 = canvasFinal.getContext('2d');
    	//el ancho y alto del canvas va a ser del ancho y alto de la imagen recortada
    	canvasFinal.height= datosDeLaImagen.height;
    	canvasFinal.width= datosDeLaImagen.width;
    	//putimagedate coloca los datos de la imagen en el canvas
    	//el primer parametros son los datos de la imagen que va colocar
    	// el segundo y el tercero son las coordenadas x y desde donde va a comenzar a dibujar la imagen
    	ctx2.putImageData(datosDeLaImagen,0,0);
    	//todataurl convierte la imagen en png de lo que estan en el canvas
    	var dataURL= canvasFinal.toDataURL();
    	window.open(dataURL);
    })
    layer.add(circle);
    layer.add(circle4);
    layer.draw();
  }
  return{
  	letsCut:letsCut
  }
})();
