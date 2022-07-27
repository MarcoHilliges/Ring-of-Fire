import { Component, OnInit } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  game$!: Observable<any>;

  gamesFromServer:any;

  public inputFormFB : FormGroup;

  constructor(private router: Router, private firestore: Firestore, private _fb: FormBuilder) { 
    const coll:any = collection(this.firestore, 'games');
    this.game$ = collectionData(coll);

    this.game$.subscribe( (gameStatus) => {
      // console.log(this.game$);
      // console.log(gameStatus);
      this.gamesFromServer = gameStatus;
    })

    // this.name.valueChanges(console.log(this.name));
    this.inputFormFB = this._fb.group({
      inputName: ['', [
        Validators.required,
        Validators.minLength(2)
      ], []]
    });
  }

  ngOnInit(): void {
  }

  newGame(){
    console.log(this.inputFormFB.value.inputName);

    let game = new Game();
    game.gameName = this.inputFormFB.value.inputName;
    const coll:any = collection(this.firestore, 'games');
    setDoc(doc(coll, this.inputFormFB.value.inputName), game.toJSON());

    this.router.navigateByUrl('/game/'+this.inputFormFB.value.inputName);
  }

  loadGame(name:string){
    this.router.navigateByUrl('/game/'+name);
  }

  deleteGame(name:string){
    const coll:any = collection(this.firestore, 'games');
    deleteDoc(doc(coll, name))
  }
}
