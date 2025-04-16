import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  cityName = '';
  weather: any;
  favoriteCities: string[] = [];

  constructor(
    private weatherService: WeatherService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  async fetchWeather(cityInput?: string) {
    const city = cityInput || this.cityName.trim();
    if (!city) {
      const toast = await this.toastController.create({
        message: 'Please enter a city name.',
        duration: 2000,
        color: 'medium',
        position: 'top',
      });
      await toast.present();
      return;
    }

    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.weather = data;
        this.cityName = '';
      },
      error: (err) => {
        this.showErrorToast('City not found');
        console.error(err);
      },
    });
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger',
      position: 'top',
    });
    await toast.present();
  }

  saveToFavorites() {
    if (!this.weather?.name) return;
    const name = this.weather.name;

    if (!this.favoriteCities.includes(name)) {
      this.favoriteCities.push(name);
      localStorage.setItem('favorites', JSON.stringify(this.favoriteCities));
    }
  }

  loadFavorites() {
    const stored = localStorage.getItem('favorites');
    this.favoriteCities = stored ? JSON.parse(stored) : [];
  }
}
