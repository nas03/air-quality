'use client';

import { MapContainer, TileLayer } from './import';

import 'leaflet/dist/leaflet.css';

export default function HomePage() {
	return (
		<MapContainer
			center={[17.9459, 105.97]}
			zoom={7}
			style={{ width: '100vw', height: '100vh' }}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
		</MapContainer>
	);
}
