import * as L from 'leaflet';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import './leaflet.css';
import Renderables from "../Renderables";
import {Circle, Icon, Marker} from "leaflet";

export class Map implements IRenderable {

    public map: any;
    public markers: Array<IMarker> = [];
    public center: [number, number] = [0, 0];
    public circle: Circle | null;
    public mapMarkers: Array<Marker>;
    public mapMarkerActive: Icon;
    public mapMarkerInactive: Icon;
    public mapContainer: HTMLDivElement;
    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
        this.mapContainer = document.createElement('div');
        this.mapMarkerActive = L.icon({
            iconUrl: 'http://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-Free-Download-PNG.png',
        });
        this.mapMarkerInactive = L.icon({
            iconUrl: 'https://cdn2.iconfinder.com/data/icons/navigation-location/512/Gps_locate_location_map_marker_navigate_navigation_pin_plan_road_route_travel_icon_-512.png',
        });
        this.mapMarkers = [];
        this.circle = null;
        const src = spec.src || "";
        this.getJSONfromURL(src);
    }

    public getJSONfromURL(src: string) {
        fetch(src).then(response =>
            response.json().then(data => {
                this.markers = data.markers;
                this.center = data.center;
            }));
    }

    public static distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = (
            Math.sin(radlat1) *
            Math.sin(radlat2) +
            Math.cos(radlat1) *
            Math.cos(radlat2) *
            Math.cos(radtheta)
        );
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        return dist * 1.609344 * 1000;
    }

    public getRadius(): number {
        const bounds = this.map.getBounds();
        return Math.min(
            Math.max(
                Math.min(
                    Map.distance(
                        bounds.getNorthEast().lat,
                        bounds.getNorthEast().lng,
                        bounds.getSouthEast().lat,
                        bounds.getSouthEast().lng,
                    ) / 2.15,
                    Map.distance(
                        bounds.getNorthEast().lat,
                        bounds.getNorthEast().lng,
                        bounds.getNorthWest().lat,
                        bounds.getNorthWest().lng,
                    ) / 2.15 ), 2000), 20000);
    }

    public drawCircle() {
        const position = this.map.getCenter();
        const radius = this.getRadius();
        if (!this.circle) {
            this.circle = L.circle([position.lat, position.lng], {radius});
            this.circle.addTo(this.map);
        } else {
            this.circle.setLatLng(position);
            this.circle.setRadius(radius);
        }

        this.mapContainer.setAttribute("value", JSON.stringify({position: this.circle!.getBounds().getCenter()}));
    }

    public drawCircleAndMarkers() {
        const position = this.map.getCenter();
        const radius = this.getRadius();
        if (!this.circle) {
            this.circle = L.circle([position.lat, position.lng], {radius});
            this.circle.addTo(this.map);
        } else {
            this.circle.setLatLng(position);
            this.circle.setRadius(radius);
        }

        const selected: Array<any> = [];
        this.mapMarkers.forEach((m: Marker) => {
            const mpos = m.getLatLng();
            const dist = Map.distance(mpos.lat, mpos.lng, position.lat, position.lng) / 1.05;
            if (dist <= radius) {
                selected.push(m);
                m.setIcon(this.mapMarkerActive);
            } else {
                m.setIcon(this.mapMarkerInactive);
            }
        });

        let markers: Array<any> = [];
        selected.forEach(m => {
            markers.push(Map.getMarkerJSON(m));
        });

        this.mapContainer.setAttribute("value", JSON.stringify({markers: markers}));
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        this.mapContainer.classList.add('lto-map');
        this.mapContainer.setAttribute("name", this.spec.name || "lto-map");

        const countMarkers = document.createElement('span');
        countMarkers.classList.add('num-markers');

        const noMarkers = document.createElement('div');
        noMarkers.classList.add('no-markers');

        this.mapContainer.appendChild(countMarkers);
        this.mapContainer.appendChild(noMarkers);

        if (isNested) {
            this.mapContainer.classList.add("lto-nested");
        }

        setTimeout(() => {
            const zoom = 13;
            const leafletSettings = {minZoom: 2, maxZoom: 14};

            const osmUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
            const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

            const osm = L.tileLayer(osmUrl, {subdomains: ['a', 'b', 'c'], attribution: osmAttrib});
            this.map = L.map(this.mapContainer, leafletSettings).setView(this.center, zoom);
            this.map.addLayer(osm);

            const mapMarkerSelected = L.icon({
                iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png'
            });

            let selected: Marker | null = null;

            if (this.markers !== undefined) {
                this.markers.forEach((data: any) => {
                    data.forEach((m: any) => {
                        const marker = L.marker(m.position, {icon: m.active ? this.mapMarkerActive : this.mapMarkerInactive, alt: m.meta !== undefined ? m.meta : {}});
                        if (this.spec.exact) {
                            if (m.active) {
                                marker.on("click", () => {
                                    if (selected !== null) {
                                        selected.setIcon(this.mapMarkerActive);
                                    }
                                    selected = marker;
                                    marker.setIcon(mapMarkerSelected);
                                    this.mapContainer.setAttribute("value", JSON.stringify(Map.getMarkerJSON(marker)));
                                })
                            }
                        }
                        this.mapMarkers.push(marker);
                        marker.addTo(this.map);
                    })

                });
                if (this.spec.exact === false) {
                    this.drawCircleAndMarkers();
                    this.map.addEventListener('moveend', this.drawCircleAndMarkers.bind(this));
                }
            } else {
                this.drawCircle();
                this.map.addEventListener('moveend', this.drawCircle.bind(this));
            }


        }, 500);

        if (this.spec.class !== undefined) this.mapContainer.classList.add(this.spec.class);

        return this.mapContainer;
    }

    public static getMarkerJSON(marker: Marker) {
        return {
            position: {
                lat: marker.getLatLng().lat,
                lng: marker.getLatLng().lng,
            },
            meta: marker.options.alt
        }
    }

}

interface IMarker {
    position: {
        lat: number
        lng: number
    }
    meta: object
    active: boolean
}

Renderables.register("map", Map);
