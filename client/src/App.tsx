// Library
import { LatLngExpression, Marker as LeafletMarker, icon } from 'leaflet';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup } from 'react-leaflet';
// Components
import { BasicMap } from '@/components';

const Settings = () => {
	const DefaultIcon = icon({
		iconUrl: markerIconUrl,
		iconRetinaUrl: markerIconRetinaUrl,
		shadowUrl: markerShadowUrl,
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	LeafletMarker.prototype.options.icon = DefaultIcon;
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
				<BasicMap />
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
