import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { collection, collectionData, doc, Firestore, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game!: Game;
  game$!: Observable<any>;
  gameId: string = '';

  constructor(private route: ActivatedRoute ,private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe(async (params) => {
      this.gameId = params['gameId'];
      onSnapshot(doc(this.firestore, "games", params['gameId']), (doc) => {
        const loadGame:any =doc.data();     
        this.updateGameData(loadGame);
      });
    })
  }

  newGame(){
    this.game = new Game();
  }

  takeCard(){
    if(!this.game.pickCardAnimation && this.game.players.length > 0){
      this.game.currentCard = 'card-backgroung';      
      this.game.pickCardAnimation =true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.currentCard = String(this.game.stack.pop()); //Removes the last element from an array and returns it.
        this.saveGame();
      }, 400);
      setTimeout(() => {     
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 2000);
    }
    else if (this.game.players.length == 0) alert('Please click the button and add a player')
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name)
        this.saveGame();
      };
    });
  }

  saveGame(){
    const coll:any = collection(this.firestore, 'games');
    setDoc(doc(coll, this.gameId), this.game.toJSON());
  }

  updateGameData(loadGame:any){
    this.game.gameName = loadGame.gameName;
    this.game.currentPlayer = loadGame.currentPlayer;
    this.game.playedCards = loadGame.playedCards;
    this.game.players = loadGame.players;
    this.game.stack = loadGame.stack;
    this.game.pickCardAnimation = loadGame.pickCardAnimation;
    this.game.currentCard = loadGame.currentCard;
  }
}
