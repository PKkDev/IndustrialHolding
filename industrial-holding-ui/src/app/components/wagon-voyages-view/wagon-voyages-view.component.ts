import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoyagesItem, WagonItem } from 'src/app/api/models';
import { TestService } from 'src/app/api/services';

@Component({
  selector: 'app-wagon-voyages-view',
  templateUrl: './wagon-voyages-view.component.html',
  styleUrls: ['./wagon-voyages-view.component.scss']
})
export class WagonVoyagesViewComponent implements OnInit {

  public wagon: WagonItem | undefined;

  private ymaps = (window as any).ymaps;
  private myMap: any | undefined;
  private multiRoute: any | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private testService: TestService
  ) { }

  ngOnInit() {

    const number = this.activatedRoute.snapshot.paramMap.get('number')

    this.testService.apiTestListGet().subscribe({
      next: (value: WagonItem[]) => {
        this.wagon = value.find(x => x.number == +number!);
      },
      error: (err) => {
        console.log('err', err);
      },
    });

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

  public onView(voyage: VoyagesItem) {

    if (this.multiRoute) {
      this.myMap.geoObjects.remove(this.multiRoute);
      this.multiRoute = null
    }

    const stations = voyage.operations?.map(x => 'станция ' + x.operStation);
    stations?.unshift(voyage.startStation!);

    this.multiRoute = new this.ymaps.multiRouter.MultiRoute({
      referencePoints: stations,

      // referencePoints: [
      //   'станция Сексеул',
      //   'станция Журын'
      // ]

      // referencePoints: [
      //   // 'Ахунбабаева',
      //   // 'Туркестан',

      //   // 'Киргили',
      //   // 'Койты'

      //   // [40.456557, 71.751571],
      //   // [43.285665, 68.212742]
      // ]
      params: {
        routingMode: "auto"
      }
    }, {
      // Внешний вид путевых точек.
      wayPointStartIconColor: "#FFFFFF",
      wayPointStartIconFillColor: "#B3B3B3",
      // Внешний вид линии активного маршрута.
      routeActiveStrokeWidth: 8,
      routeActiveStrokeStyle: 'solid',
      routeActiveStrokeColor: "#002233",
      // Внешний вид линий альтернативных маршрутов.
      routeStrokeStyle: 'dot',
      routeStrokeWidth: 3,
      boundsAutoApply: true
    });
    this.myMap.geoObjects.add(this.multiRoute);

  }

}
