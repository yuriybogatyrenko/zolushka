import {Component, Input, OnInit} from '@angular/core';
import {PopupsService} from '../../../services/popups/popups.service';

@Component({
  selector: 'app-popup-notice-confirmed-photos',
  templateUrl: './popup-notice-confirmed-photos.component.html',
  styleUrls: ['./popup-notice-confirmed-photos.component.sass', '../../../../sass/components/page-section.component.sass']
})
export class PopupNoticeConfirmedPhotosComponent implements OnInit {

  @Input() visible: boolean = false;

  constructor(private _popupsService: PopupsService) { }

  ngOnInit() {
  }

  closePopup(e) {
    if (e.target.classList.contains('popup-wrapper') || e.target.classList.contains('js-close-popup')) {
      this._popupsService.closePopup('buyConfirmedPhotos');
    }
  }
}
