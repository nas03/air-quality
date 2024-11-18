import { Map } from '@/components';
import '@maptiler/leaflet-maptilersdk';
import L, { LatLngExpression } from 'leaflet';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup } from 'react-leaflet';

const Settings = () => {
	const DefaultIcon = L.icon({
		iconUrl: markerIconUrl,
		iconRetinaUrl: markerIconRetinaUrl,
		shadowUrl: markerShadowUrl,
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	L.Marker.prototype.options.icon = DefaultIcon;
	return null;
};

function App() {
	const position: LatLngExpression = [17.9459, 105.97];
	return (
		<>
			<MapContainer
				center={position}
				zoom={4.5}
				scrollWheelZoom={true}
				style={{ height: '100vh', width: '100vw' }}
				preferCanvas={true}>
				<Settings />
				<Map />
				<Marker position={position}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
			</MapContainer>
		</>
	);
}

export default App;
