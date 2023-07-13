import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { VoyagesItemDto } from 'src/app/api/models';
import { WagonService } from 'src/app/api/services';
import { MULTI_ROUTER_SETTINGS } from 'src/app/constants/y-map';

@Component({
  selector: 'app-wagon-voyages-view',
  templateUrl: './wagon-voyages-view.component.html',
  styleUrls: ['./wagon-voyages-view.component.scss']
})
export class WagonVoyagesViewComponent implements OnInit, OnDestroy {

  public ways: VoyagesItemDto[] = [];
  private wagonNumber: number | undefined;

  private loadDataSubs?: Subscription

  private ymaps = (window as any).ymaps;
  private myMap: any | undefined;
  private multiRoute: any | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: WagonService
  ) { }

  ngOnInit() {
    const number = this.activatedRoute.snapshot.paramMap.get('number')
    this.wagonNumber = +number!;

    this.loadData();
    this.intYMap();
  }

  ngOnDestroy() {
    this.loadDataSubs?.unsubscribe();
  }

  private loadData() {
    this.loadDataSubs = this.api.apiWagonWayListGet(
      { wagonNumber: this.wagonNumber })
      .subscribe({
        next: (value: VoyagesItemDto[]) => {
          this.ways = value;
        },
        error: (err) => { },
      });
  }

  private intYMap() {
    console.log('this.ymaps', this.ymaps);

    this.ymaps.ready(() => {
      this.myMap = new this.ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7,
        controls: ['typeSelector', 'fullscreenControl', 'zoomControl']
      });

      const ListBoxLayout = this.ymaps.templateLayoutFactory.createClass(
        "<button id='my-listbox-header' class='dropdown-menu-toggle' data-toggle='dropdown'>" +
        "{{data.title}} <span class='caret'></span>" +
        "</button>" +
        "<ul id='my-listbox'" +
        " class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu'" +
        " style='display: {% if state.expanded %}block{% else %}none{% endif %};'></ul>", {
        build: function () {
          ListBoxLayout.superclass.build.call(this);
          this.childContainerElement = document.getElementById('my-listbox');
          this.events.fire('childcontainerchange', {
            newChildContainerElement: this.childContainerElement,
            oldChildContainerElement: null
          });
        },
        getChildContainerElement: function () {
          return this.childContainerElement;
        },
        clear: function () {
          this.events.fire('childcontainerchange', {
            newChildContainerElement: null,
            oldChildContainerElement: this.childContainerElement
          });
          this.childContainerElement = null;
          ListBoxLayout.superclass.clear.call(this);
        }
      });
      const ListBoxItemLayout = this.ymaps.templateLayoutFactory.createClass(
        "<li><a>{{data.content}}</a></li>"
      );

      const listBoxItems = [
        new this.ymaps.control.ListBoxItem({
          data: {
            content: 'Весь путь',
            center: [55.751574, 37.573856],
            zoom: 9
          }
        }),
        new this.ymaps.control.ListBoxItem({
          data: {
            content: 'Станции',
            center: [54.990215, 73.365535],
            zoom: 9
          }
        })
      ];
      const listBox = new this.ymaps.control.ListBox({
        items: listBoxItems,
        data: {
          title: 'Выбрать режим'
        },
        options: {
          layout: ListBoxLayout,
          itemLayout: ListBoxItemLayout
        }
      });
      this.myMap.controls.add(listBox, { float: 'left' });

      console.log('this.myMap', this.myMap);
    });
  }

  public onView(voyage: VoyagesItemDto) {
    if (this.multiRoute)
      this.myMap.geoObjects.remove(this.multiRoute);

    const stations = voyage.operations?.map(x => 'станция ' + x.operStation);
    stations?.unshift('станция ' + voyage.startStation!);
    console.log(stations);

    this.multiRoute = new this.ymaps.multiRouter
      .MultiRoute(
        {
          referencePoints: stations,
          params: {
            routingMode: "auto"
          }
        },
        MULTI_ROUTER_SETTINGS);

    this.myMap.geoObjects.add(this.multiRoute);
  }

}
