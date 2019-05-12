
		//Game variable6
		var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos=3, velocidade = 6, estadoAtual, record, img,

		estados = {
			jogar:0,
			jogando:1,
			perdeu:2
		},

		chao = {
			y: 550,
			x: 0,
			altura: 50,

			atualiza: function(){
				this.x -= velocidade;
				if (this.x <= -30)
					this.x = 0;
			},

			desenha: function() {
				spriteChao.desenha(this.x, this.y);
				spriteChao.desenha(this.x + spriteChao.largura, this.y);
			}
		},

		bloco = {
			x:100,
			y:0,
			altura: spriteBoneco2.altura,
			largura: spriteBoneco2.largura,
		
			gravidade:1.6,
			velocidade:0,
			forcaDoPulo: 30,
			qntPulos: 0,
			score: 0,
			rotacao:0,

			atualiza: function() {
				this.velocidade += this.gravidade;
				this.y += this.velocidade;
				this.rotacao += Math.PI / 180 * velocidade;

				if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
					this.y = chao.y - this.altura;
					this.qntPulos = 0;
					this.velocidade = 0;
				}
			},
			pula: function(){
				if (this.qntPulos < maxPulos){
					this.velocidade = -this.forcaDoPulo;
					this.qntPulos++; 
				}
			},

			reset: function(){
				this.y = 0;
				this.velocidade = 0;

				if (this.score > record){
					localStorage.setItem("record", this.score);
					record = this.score;
				}

				this.score = 0;
			},

			desenha: function() {
				ctx.save();
				//operacoes para rotacionar
				ctx.translate(this.x + this.largura / 2, this.y + this.altura / 2);
				ctx.rotate(this.rotacao);
				spriteBoneco2.desenha(-this.largura / 2, -this.altura  / 2);

				ctx.restore();
				//ctx.fillStyle = this.cor;
				//ctx.fillRect(this.x, this.y, this.largura, this.altura);
			}
		},

		obstaculos = {
			_obs:[],
			cores: ["#ffbc1c", "#ff1c1c","#ff85e1"],
			tempoInsere: 0,

			insere: function() {
				this._obs.push({
					x:LARGURA,
					//largura: 30 + Math.floor(21 * Math.random()),
					largura:30,
					altura: 30 + Math.floor(80 * Math.random()),
					cor:this.cores[Math.floor(3 * Math.random())]
				});

				this.tempoInsere = 50 + Math.floor(30 * Math.random());
			},
			atualiza: function() {
				if(this.tempoInsere == 0)
					this.insere();
				else
					this.tempoInsere--;
				for(var i = 0, tam = this._obs.length; i< tam; i++){
					var obs = this._obs[i];

					obs.x -= velocidade;

					if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura){
						estadoAtual = estados.perdeu;
					}
					else if(obs.x == 0){
						bloco.score++;
					}
					else if (obs.x <= -obs.largura){
						this._obs.splice(i,1);
						tam--;
						i--;
					}
				}
			},

			limpa: function() {
				this._obs = [];
			},

			desenha: function(){
				for(var i =0, tam= this._obs.length; i < tam; i++){
					var obs = this._obs[i];
					ctx.fillStyle = obs.cor;
					ctx.fillRect(obs.x, chao.y- obs.altura, obs.largura, obs.altura);
				}
			}
		};

		//	Game functions
		
		// function keyPush(event){
		// 	bloco.pula();
		// }

		function clique(event) {
			if (estadoAtual == estados.jogando){
				bloco.pula();
			}
			else if(estadoAtual == estados.jogar){
				estadoAtual = estados.jogando;
			}
			else if(estadoAtual == estados.perdeu){
				estadoAtual = estados.jogar;
				obstaculos.limpa();
				bloco.reset();
			}
			
		}
			
		function main() {
			ALTURA = window.innerHeight;
			LARGURA = window.innerWidth;

			if (LARGURA >= 500){
				LARGURA = 600;
				ALTURA = 600;
			}

			canvas = document.createElement("canvas");
			canvas.width = LARGURA;
			canvas.height = ALTURA;
			canvas.style.border = "1px solid #000";

			ctx = canvas.getContext("2d");
			document.body.appendChild(canvas);

			document.addEventListener("mousedown", clique);
			document.addEventListener("keydown", clique);

			estadoAtual = estados.jogar;
			record = localStorage.getItem("record");

			if (record == null)
				record = 0;

			img = new Image();
			img.src = "img/sheetn1.png"

			roda();

		}
		function roda() {
			atualiza();
			desenha();

			window.requestAnimationFrame(roda);

		}
		function atualiza() {

			if(estadoAtual == estados.jogando){
				obstaculos.atualiza();
			}

			chao.atualiza();
			bloco.atualiza();
		}
		function desenha() {
			bg.desenha(0, 0);

			ctx.fillStyle = "#fff";
			ctx.font = "50px Arial";
			ctx.fillText(bloco.score, 30, 68);

			if (estadoAtual == estados.jogando)
				obstaculos.desenha();
			
			chao.desenha();
			bloco.desenha();

			if (estadoAtual == estados.jogar)
				jogar.desenha(LARGURA/2 - jogar.largura /2, ALTURA / 2 - jogar.altura/2);

			if (estadoAtual == estados.perdeu) {
				perdeu.desenha(LARGURA / 2 - perdeu.largura /2, ALTURA/2 - perdeu.altura/2 - spriteRecord.altura/2);
				spriteRecord.desenha(LARGURA/2 - spriteRecord.largura/2, ALTURA /2 + perdeu.altura /2- spriteRecord.altura/2 -25);

				ctx.fillStyle = "#fff";
				ctx.fillText(bloco.score, 375, 390);

				if (bloco.score > record) {
					novo.desenha(LARGURA/2 -180, ALTURA /2 +30);
					ctx.fillText(bloco.score, 420, 470);
				}	
				else
					ctx.fillText(record, 420, 470);
				

			}

			

		}

		

		//START
		main();