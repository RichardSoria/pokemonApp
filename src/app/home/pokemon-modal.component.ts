// pokemon-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="ion-text-capitalize">{{ pokemonName }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="pokemonDetails; else loading" class="ion-padding">
      <ion-img [src]="pokemonDetails.sprites.front_default"></ion-img>
      <p><strong>Altura:</strong> {{ pokemonDetails.height }}</p>
      <p><strong>Peso:</strong> {{ pokemonDetails.weight }}</p>
      <p><strong>Tipos:</strong> {{ getTypes() }}</p>
      <p><strong>Habilidades:</strong> {{ getAbilities() }}</p>
    </ion-content>

    <ng-template #loading>
      <ion-spinner></ion-spinner>
      <p>Cargando detalles...</p>
    </ng-template>
  `
})
export class PokemonModal implements OnInit {
  @Input() pokemonName!: string;
  pokemonDetails: any;

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() {
    this.loadDetails();
  }

  async loadDetails() {
    try {
      this.pokemonDetails = await this.http.get(`https://pokeapi.co/api/v2/pokemon/${this.pokemonName}`).toPromise();
    } catch (error) {
      console.error('Error cargando detalles', error);
      this.pokemonDetails = null;
    }
  }

  getTypes(): string {
    return this.pokemonDetails.types.map((t: any) => t.type.name).join(', ');
  }

  getAbilities(): string {
    return this.pokemonDetails.abilities.map((a: any) => a.ability.name).join(', ');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
