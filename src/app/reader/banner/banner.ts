import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { BannerService } from '../../_services/banner.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner implements OnInit {

  banners: any[] = [];
  visibleBanners: any[] = [];

  slideIndex = 0;
  slideSize = 3;

  loading = true;
  private apiBaseUrl = "http://localhost:8177";

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners() {
    this.loading = true;
    this.bannerService.getAllBanner().subscribe({
      next: res => {
        this.banners = (res.data || []).filter((b: any) => b.status === 1);
        this.updateVisibleBanners();
        this.loading = false;
      }
    });
  }

  getImage(path: string): string {
    return this.apiBaseUrl + path;
  }

  updateVisibleBanners() {
    const total = this.banners.length;
    let result: any[] = [];
    for (let i = 0; i < this.slideSize; i++) {
      if (total === 0) break;
      const index = (this.slideIndex + i) % total;
      result.push(this.banners[index]);
    }
    this.visibleBanners = result;
  }


  nextSlide() {
    if (this.banners.length === 0) return;
    this.slideIndex = (this.slideIndex + 1) % this.banners.length;
    this.updateVisibleBanners();
    this.triggerAnimation();
  }

  prevSlide() {
    if (this.banners.length === 0) return;
    this.slideIndex = (this.slideIndex - 1 + this.banners.length) % this.banners.length;
    this.updateVisibleBanners();
    this.triggerAnimation();
  }

  triggerAnimation() {
    const el = document.querySelector('.slide-container') as HTMLElement | null;
    if (!el) return;

    el.classList.remove('slide-fade');
    void el.offsetWidth;
    el.classList.add('slide-fade');
  }

}
