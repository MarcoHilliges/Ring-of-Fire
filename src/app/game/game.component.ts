import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { collection, collectionData, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  game$!: Observable<any>;
  activeGame$!:any;
  game1!:any;


  constructor(private route: ActivatedRoute ,private firestore: Firestore, public dialog: MatDialog) { 
    
  }

  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe(async (params) => {
      console.log(params['gameId']);

      const coll:any = collection(this.firestore, 'games');  // greift auf das JSON todos in Firebase zu
      console.log('coll', coll);
      
      const docRef = doc(this.firestore, "games", params['gameId']);
      const docSnap = await getDoc(docRef);
      
      console.log("Document data:", docSnap.data());
     

  


      this.game$ = collectionData(coll);

      this.game$.subscribe( (gameStatus) => {
      console.log(this.game$);
      console.log(gameStatus)

    })
    })
  }

  newGame(){
    this.game = new Game();

    const coll:any = collection(this.firestore, 'games');
    setDoc(doc(coll, 'game1'), this.game.toJSON());
  }

  takeCard(){
    if(!this.pickCardAnimation){
      this.currentCard = String(this.game.stack.pop()); //Removes the last element from an array and returns it.
      
      this.pickCardAnimation =true;
      // console.log('New Card' + this.currentCard);
      // console.log('Game is' , this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) this.game.players.push(name);
    });
  }
}
