import '@maptiler/leaflet-maptilersdk';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';
const Map = () => {
	const map = useMap();
	/* maptilersdk.config.apiKey = 'Y2LLlbvRVwaYxT2YxjWV'; */
	/* const map = new maptilersdk.Map({
		container: 'map', // container's id or the HTML element to render the map
		style: maptilersdk.MapStyle.STREETS,
		center: [16.62662018, 49.2125578], // starting position [lng, lat]
		zoom: 14, // starting zoom
	}); */
	L.tileLayer(
		'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=Y2LLlbvRVwaYxT2YxjWV',
		{
			attribution:
				'\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
		}
	).addTo(map);
	return null;
};

export default Map;
