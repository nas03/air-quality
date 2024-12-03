import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';
const BasicMap = () => {
	const map = useMap();
	L.tileLayer(
		'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=Y2LLlbvRVwaYxT2YxjWV',
		{
			attribution:
				'\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
		}
	).addTo(map);
	return null;
};

export default BasicMap;
