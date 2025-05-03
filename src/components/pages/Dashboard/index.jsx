import React from 'react';
import "./styles.min.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faEnvelope, faCog } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Navbar';

export default function Dashboard() {
  return (
    <>
    <Navbar />
    <div className="dashboard-container container mt-5">
      <h1 className="text-center mb-4 text-primary">Dashboard</h1>
      
      <div className="row">
        {/* Card Meus Produtos */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm rounded-lg border-0">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faBoxOpen} size="3x" className="text-primary" />
              <h5 className="card-title mt-3">Meus Produtos</h5>
              <div className="d-flex flex-column">
                <Link to="/view_products">
                  <button className="btn btn-outline-primary w-100 mb-2">Ver Produtos</button>
                </Link>
                <Link to="/dashboard/new_products">
                  <button className="btn btn-outline-success w-100">Criar Produto</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card Mensagens */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm rounded-lg border-0">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-info" />
              <h5 className="card-title mt-3">Mensagens</h5>
              <Link to="/messages">
                <button className="btn btn-outline-info w-100">Ver Mensagens</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Card Configurações de Admin */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm rounded-lg border-0">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faCog} size="3x" className="text-danger" />
              <h5 className="card-title mt-3">Configurações de Admin</h5>
              <Link to="/admin_settings">
                <button className="btn btn-outline-danger w-100">Configurações</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
