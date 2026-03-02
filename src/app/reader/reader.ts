import { Component,OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {Router, RouterOutlet} from '@angular/router';
import {Header} from './header/header';
import {Footer} from './footer/footer';

@Component({
  selector: 'app-reader',
  imports: [
    RouterOutlet,
    Header,
    Footer
  ],
  templateUrl: './reader.html',
  styleUrl: './reader.css',
})
export class Reader implements OnInit {
  user: any;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getReaderByToken(token).subscribe({
        next: (res) => {
          if (res.status === 200 && res.data) {
            this.user = res.data;
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        },
        error: (err) => console.error('Lỗi khi lấy user:', err)
      });
    }
  }

}
