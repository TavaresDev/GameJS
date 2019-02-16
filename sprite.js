function Sprite(x, y, largura, altura) {
	this.x = x
	this.y = y
	this.largura = largura
	this.altura = altura

	this.desenha = function(xcanvas, ycanvas){
		ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xcanvas, ycanvas, this.largura, this.altura);
	}
}

var bg = new Sprite(0, 0, 600, 600),
spriteBoneco = new Sprite(618, 16, 87, 87);