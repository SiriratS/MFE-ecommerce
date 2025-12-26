import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartComponent } from '@ecommerce-platform/cart';

@Component({
  imports: [CartComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'cart-mfe';
}
