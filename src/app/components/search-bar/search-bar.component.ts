import {
    Component, OnInit, Input, ElementRef, ViewEncapsulation, Output, EventEmitter,
    HostListener
} from '@angular/core';

import {LocationService} from '../../services/location/location.service';
import {ISelectSearchBoxItem} from '../../interfaces/form/select-search-box-item.interface';
import {IEnums} from '../../interfaces/enums.interface';
import {EnumsService} from '../../services/enums/enums.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.sass', '../dropdown/dropdown.component.sass', '../form/input-box/input-box.component.sass'],
    providers: [LocationService],
    encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent implements OnInit {
    @Input() widget: boolean = false;
    @Input() classes: string = '';
    @Output() onSubmitSearchBar: EventEmitter<any> = new EventEmitter();


    public locations: Array<ISelectSearchBoxItem> = [];
    public hiddenSearchBarFilters = true;

    private searchBarActiveClass: string = 'search-bar--active';
    private searchBarToggleTimeout: any;
    private searchBarMainToggleTimeout: any;
    public searchType = 200;
    public FSearchBar: FormGroup;

    public enums = new IEnums();

    public rangeSliderValues = {
        minAge: 19,
        maxAge: 27
    };

    @HostListener('document:click', ['$event'])
    clickOutsideOfComponent(e) {
        if (!e.target.closest('.dropdown') && document.querySelector('.dropdown.dropdown--active')) {
            document.querySelector('.dropdown.dropdown--active').classList.remove('dropdown--active');
        }
    }

    constructor(private _activatedRouter: ActivatedRoute, private _fb: FormBuilder, private _enums: EnumsService, private _component: ElementRef, private _locationService: LocationService) {
    }

    ngOnInit() {
        this.initLocation();

        this._enums.getEnums().subscribe(response => {
            this.enums = response;

            this._activatedRouter.queryParams.subscribe(params => {
                this.renderFormChosenValues();

            });
        });
    }

    initLocation(locationName: string = null) {
        this._locationService.getLocations(locationName).subscribe((locations: Array<any>) => {
            const locationsArray = [];
            locations.map((location: any) => {
                locationsArray.push({
                    id: location.id,
                    selected: false,
                    label: location.title,
                    labelInfo: location.country.title
                });
            });

            this.locations = locationsArray;
        });
    }

    searchOnChangeAge(e) {
        this.FSearchBar.controls['minAge'].setValue({id: e.from});
        this.FSearchBar.controls['maxAge'].setValue({id: e.to});
    }

    getLocations(locationName) {
        this.initLocation(locationName);
    }

    searchProfiles(e) {
        e.preventDefault();
        const newSearchParams = Object.assign({}, this._activatedRouter.snapshot.queryParams, ...this.FSearchBar.value);
        if (!!newSearchParams['page']) {
            delete newSearchParams.page;
        }

        console.log(newSearchParams);
        this.onSubmitSearchBar.emit(newSearchParams);
    }

    searchBarToggle(e) {
        e.preventDefault();

        const searchBar: HTMLElement = this._component.nativeElement.children[0];
        const searchBarContent: HTMLElement = <HTMLElement>searchBar.getElementsByClassName('search-bar__content')[0];

        clearTimeout(this.searchBarMainToggleTimeout);
        clearTimeout(this.searchBarToggleTimeout);

        if (searchBar.classList.contains(this.searchBarActiveClass)) {
            this.searchBarMainToggleTimeout = setTimeout(() => {
                searchBarContent.style.overflow = 'hidden';

                this.searchBarToggleTimeout = setTimeout(() => {
                    searchBar.classList.remove(this.searchBarActiveClass);
                }, 1);
            }, 1);
        } else {
            this.searchBarMainToggleTimeout = setTimeout(() => {
                searchBar.classList.add(this.searchBarActiveClass);

                this.searchBarToggleTimeout = setTimeout(() => {
                    searchBarContent.style.overflow = 'initial';
                }, 501);
            }, 1);
        }
    }

    renderFormChosenValues() {
        const filterParams = this._activatedRouter.snapshot.queryParams;
        const newFilterObject = {};
        for (const key in filterParams) {
            const Value = filterParams[key];
            if (Object.prototype.toString.call(Value) === '[object Array]') {
                newFilterObject[key] = [];
                for (let i = 0; i < Value.length; i++) {
                    newFilterObject[key].push({id: Value[i]});
                }
            } else {
                newFilterObject[key] = {id: parseInt(filterParams[key], 0)};
            }
        }

        this.FSearchBar = this._fb.group({
            type: [(!!newFilterObject['type']) ? newFilterObject['type'] : {id: 200}],
            cityId: [(!!newFilterObject['cityId']) ? newFilterObject['cityId'] : {}],
            relationshipTypes: [(!!newFilterObject['relationshipTypes']) ? newFilterObject['relationshipTypes'] : {}],
            appearance: [(!!newFilterObject['appearance']) ? newFilterObject['appearance'] : {}],
            sexualPeriodicity: [(!!newFilterObject['sexualPeriodicity']) ? newFilterObject['sexualPeriodicity'] : {}],
            relationshipState: [(!!newFilterObject['relationshipState']) ? newFilterObject['relationshipState'] : {}],
            childrenExist: [(!!newFilterObject['childrenExist']) ? newFilterObject['childrenExist'] : {}],
            hairColor: [(!!newFilterObject['hairColor']) ? newFilterObject['hairColor'] : {}],
            eyeColor: [(!!newFilterObject['eyeColor']) ? newFilterObject['eyeColor'] : {}],
            sexualRole: [(!!newFilterObject['sexualRole']) ? newFilterObject['sexualRole'] : {}],
            zodiacsign: [(!!newFilterObject['zodiacsign']) ? newFilterObject['zodiacsign'] : {}],
            physique: [(!!newFilterObject['physique']) ? newFilterObject['physique'] : {}],
            higherEducation: [(!!newFilterObject['higherEducation']) ? newFilterObject['higherEducation'] : {}],
            breastSize: [(!!newFilterObject['breastSize']) ? newFilterObject['breastSize'] : {}],
            sexualKinds: [(!!newFilterObject['sexualKinds']) ? newFilterObject['sexualKinds'] : {}],
            sexualPreference: [(!!newFilterObject['sexualPreference']) ? newFilterObject['sexualPreference'] : {}],
            hobbies: [(!!newFilterObject['hobbies']) ? newFilterObject['hobbies'] : {}],
            minAge: [(!!newFilterObject['minAge']) ? newFilterObject['minAge'] : {id: 19}],
            maxAge: [(!!newFilterObject['maxAge']) ? newFilterObject['maxAge'] : {id: 27}],
            minHeight: [(!!newFilterObject['minHeight']) ? newFilterObject['minHeight'].id : ''],
            maxHeight: [(!!newFilterObject['maxHeight']) ? newFilterObject['maxHeight'].id : ''],
            minWeight: [(!!newFilterObject['minWeight']) ? newFilterObject['minWeight'].id : ''],
            maxWeight: [(!!newFilterObject['maxWeight']) ? newFilterObject['maxWeight'].id : ''],
        });

        this.rangeSliderValues = {
            minAge: this.FSearchBar.value.minAge.id,
            maxAge: this.FSearchBar.value.maxAge.id,
        };

        this.hiddenSearchBarFilters = false;
    }

    switchType(e) {
        this.searchType = parseInt(e.target.value, 0);
    }

    dropdownEvent(e: Event) {
        e.preventDefault();

        const target: HTMLElement = <HTMLElement>e.target;
        const parent = <HTMLElement>target.closest('.dropdown');

        return (!parent.classList.contains('dropdown--active'))
            ? parent.classList.add('dropdown--active')
            : parent.classList.remove('dropdown--active');
    }

    resetForm(e: Event) {
        e.preventDefault();
        for (const key in this.FSearchBar.value) {
            if (key !== 'minAge' && key !== 'maxAge') {
                this.FSearchBar.controls[key].setValue(null);
            }
        }
    }
}
