import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, delay, map, startWith, switchMap } from 'rxjs';
import { ProductSearch } from './types';

@Component({
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, FormsModule, NgFor],
  selector: 'nx-playground-root',
  template: `
    <input
      class="searchbox"
      type="text"
      placeholder="Rechercher un produit..."
      [ngModel]="productSearch()"
      (ngModelChange)="productSearch.set($event)"
    />

    <table>
      <thead>
        <tr>
          <th class="cell">Produit</th>

          <th class="cell">Catégorie</th>

          <th class="cell">Prix</th>
        </tr>
      </thead>

      <tbody>
        <tr
          *ngFor="let product of issuedProducts$ | async; let even = even"
          [class.bg-slate-50]="even"
          [class.bg-slate-200]="!even"
        >
          <td class="cell">{{ product.title }}</td>

          <td class="cell">{{ product.category }}</td>

          <td class="cell">{{ product.price | currency }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    ':host { @apply flex flex-col gap-y-4 p-4 }',
    '.searchbox { @apply px-4 py-2 border-solid border-2 border-slate-300 rounded-md }',
    '.cell { @apply px-4 py-2 }',
  ],
})
export class AppComponent {
  #httpClient = inject(HttpClient);

  productSearch = signal('');

  issuedProducts$ = toObservable(this.productSearch).pipe(
    debounceTime(500), // émet après 500ms sans taper (une recherche)
    switchMap(
      // annule toute recherche en cours ou map la valeur reçu en une nouvelle recherche
      (searchTerm) =>
        this.#httpClient.get<ProductSearch>('https://dummyjson.com/products/search?q=' + searchTerm).pipe(
          map(({ products }) => products),
          delay(1000) // simule du délai
        )
    ),
    startWith([])
  );

  /*
    LÉGENDE -----------------------------------------------------------------------------------------------------------------------------
      - : frame
      ^ : subscription
      ! : unsubscribe
      | : completion
      r : représente la nouvelle recherche émise
      p : liste de produits reçus

    PROBLÈME ----------------------------------------------------------------------------------------------------------------------------
      recherche :                    ----r-r-r--r-r---r----

                                     v debounceTime(--|) v  (ici 3 frames)

      recherche après debounceTime : ----------r----r---r--

                                     vvvv switchMap(p) vvvv

                       resultats 1 : ----------^----!       (=> annulée car trop longue)
                       resultats 2 : ---------------^--p|   (=> émet alors qu'une nouvelle recherche est la)
                       resultats 3 : -------------------^p|

      => Dans l'exemple ci-dessus on voit que :
        - on emet 3x la recherche, après 300ms sans rien taper
        - on passe dans le switchMap pour rechercher les produits
          - resultats 1 : on l'annule car elle prend trop de temps et qu'une nouvelle recherche est arrivée entre temps (switchMap)
          - resultats 2 : on émet la liste de la recherhce précédente alors qu'on a modifié la recherche entre temps (deounceTime cause ce décallage)
            => recheche / résultat : pas syncrho !
          - resultats 3 : on ré-émet la nouvelle liste qui matche cette fois la recherche

    SOLUTION ----------------------------------------------------------------------------------------------------------------------------
      Pour solutionner cette petite problématique, il faudrait un opérateur qui combine à la fois le debounceTime et swithcMap
      => debounceTimeMap !
  */

  /*  solvedProducts$ = toObservable(this.productSearch).pipe(
    debounceTimeMap(
      (searchTerm) =>
        this.#httpClient.get<ProductSearch>('https://dummyjson.com/products/search?q=' + searchTerm).pipe(
          map(({ products }) => products),
          delay(1000) // simule du délai
        ),
      500
    ),
    startWith([])
  ); */
}
