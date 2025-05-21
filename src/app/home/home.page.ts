import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PokemonModal } from './pokemon-modal.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class HomePage implements OnInit {

  pokemons: any[] = [];
  pokemonFilter: any[] = [];
  offset = 0;
  limit = 20;
  loading = false;
  nameFind: string = '';

  constructor(private http: HttpClient, private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    if (this.loading) return;
    this.loading = true;
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`)
      .subscribe(
        (response) => {
          this.pokemons = [...this.pokemons, ...response.results];
          this.offset += this.limit;

          if (event) {
            event.target.complete();
          }

          if (response.next === null && event) {
            event.target.disabled = true;
          }
        }
      );
  }

  getImageUrl(index: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`;
  }

  getDetails(name: string): string {
    return `https://pokeapi.co/api/v2/pokemon/${name}`;
  }

  async findPokemon() {
    const name = this.nameFind.trim().toLocaleLowerCase();
    if (!name) {
      this.pokemonFilter = this.pokemons;
      return;
    }

    // Filtrar localmente
    this.pokemonFilter = this.pokemons.filter(pokemon => pokemon.name.toLocaleLowerCase().includes(name));

    if (this.pokemonFilter.length === 0) {
      // No encontró nada, muestra alerta
      const alert = await this.alertCtrl.create({
        header: 'No encontrado',
        message: `No se encontró ningún Pokémon con el nombre "${this.nameFind}".`,
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Si encontró, abre modal con el primer resultado
    const modal = await this.modalCtrl.create({
      component: PokemonModal,
      componentProps: { pokemonName: this.pokemonFilter[0].name }
    });
    await modal.present();
  }

}


