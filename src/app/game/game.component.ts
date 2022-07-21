import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;


  constructor() { 

  }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){
    this.game = new Game();
  }

  takeCard(){
    if(!this.pickCardAnimation){
      this.currentCard = String(this.game.stack.pop()); //Removes the last element from an array and returns it.
      
      this.pickCardAnimation =true;
      console.log('New Card' + this.currentCard);
      console.log('Game is' , this.game);

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }
}