import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from '../services/api';

import '../styles/pages/delete-orphanage.css';

interface OrphanageParams {
  id: string;
}
   
function DeleteOrphanage() {
  const history = useHistory();
  const params = useParams<OrphanageParams>();
  const [orphanageName, setOrphanageName] = useState<string>('');

  useEffect(() =>{
    api.get(`orphanages/${params.id}`).then(response => {
      setOrphanageName(response.data.name);
    });
  }, [params.id]);

  async function handleDeleteButton() {
    await api.delete(`orphanages/${params.id}`);

    alert('Orfanato excluido com sucesso!');

    history.push('/dashboard');
  }

  return (
    <div id="page-delete-orphanage">
      <div className="content-wrapper">
        <main>
          <h1 className="title-delete">Excluir!</h1>
          <p className="text-delete">Você tem certeza que quer excluir {orphanageName}?</p>

          <button
            className="button-delete"
            onClick={handleDeleteButton}
          >
            Sim
          </button>

          <Link className="button-return" to="/dashboard">
            Voltar para o dashboard
          </Link>
        </main>
      </div>
    </div>
  );
}

export default DeleteOrphanage;