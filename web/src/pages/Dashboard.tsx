import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiAlertCircle, FiPower, FiEdit3, FiTrash } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import mapMarkerImg from '../images/map-marker.svg';
import api from '../services/api';

import '../styles/pages/dashboard.css';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function Dashboard() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  return (
    <div id="page-dashboard">
      <aside className="app-sidebar dashboard-sidebar">
        <img src={mapMarkerImg} alt="Happy" />

        <div className="sidebar-nav-icons">
          <Link to={'/dashboard'} className="pin-button active">
            <FiMapPin size={24} color="#FFF" />
          </Link>
          <Link to={'/dashboard/pending'} className="alert-button notification">
            <FiAlertCircle size={24} color="#FFF" />
          </Link>
        </div>

        <footer>
          <Link to={'/'}>
            <FiPower size={24} color="#FFF" />
          </Link>
        </footer>
      </aside>

      <main>
        <div className="page-header">
          <h1 className="page-title">Orfanatos Cadastrados</h1>
          <p className="qtd-items text-color">2 orfanatos</p>
        </div>
        <div className="page-content">
          <div className="orphanages-list">
            {orphanages.map(orphanage => {
              return(
                <div className="orphanage">
                  <Map
                    center={[ orphanage.latitude, orphanage.longitude ]}
                    zoom={15}
                    className="orphanage-map"
                  >
                    <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
                  </Map>
                  <div className="orphanage-content">
                    <h2 className="text-color">{orphanage.name}</h2>
                    <div className="orphanage-buttons">
                      <Link className="edit-button" to={`/orphanages/edit/${orphanage.id}`}>
                        <FiEdit3 size={24} color="#15C3D6" />
                      </Link>

                      <Link className="remove-button" to={`/orphanages/remove/${orphanage.id}`}>
                        <FiTrash size={24} color="#15C3D6" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;