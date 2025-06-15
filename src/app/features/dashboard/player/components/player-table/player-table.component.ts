import { Component, Input } from '@angular/core';
import { UserPlayer } from '../../../../../core/interfaces/user';

@Component({
  selector: 'app-player-table',
  standalone: true,
  imports: [],
  templateUrl: './player-table.component.html',
  styleUrl: './player-table.component.scss'
})
export class PlayerTableComponent {

  @Input() players: UserPlayer[] = [];

  ngOnInit(): void {
    console.log(this.players)
  }

}
