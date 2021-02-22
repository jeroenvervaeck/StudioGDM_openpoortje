import { default as React, useContext, createContext, useState } from 'react';
import { Kid } from '../components';

import { apiConfig } from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const BASE_URL = `${apiConfig.baseURL || "http://localhost:8080"}`;

  const [ user, setUser ] = useState(JSON.parse(sessionStorage.getItem('user')));

  const setCookie =(name,value,days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  const getCookie = (name) => {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }

  const eraseCookie = (name) => {   
      document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  const updateUserData = async () => {
    console.log('check')
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/${auth.role}`;

    const options = {
      method:'GET',
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    sessionStorage.setItem('user', JSON.stringify(response));
    setUser(response);

    return response;
  }

  const getKidsOfOrganisation = async ( role='supervisor' ) => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/${role}/kids`;
    
    const options = {
      method:'GET',
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const getSupervisorsOfOrganisation = async () => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/supervisors`;
    
    const options = {
      method:'GET',
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const editKid = async ( kidId, changes ) => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/kid`;

    const body = {
      id: kidId,
      changes,
    }

    const options = {
      method:'PATCH',
      body: JSON.stringify(body),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const newKid = async ( kid ) => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/kid`;

    const options = {
      method:'POST',
      body: JSON.stringify(kid),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const deleteKid = async ( kidId ) => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/kid`;

    const options = {
      method:'DELETE',
      body: JSON.stringify({id: kidId}),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  return (
    <ApiContext.Provider value={{ 
      user,
      setCookie,
      getCookie,
      eraseCookie,
      updateUserData,
      getKidsOfOrganisation,
      editKid,
      newKid,
      deleteKid,
      getSupervisorsOfOrganisation
     }}>
      {children}
    </ApiContext.Provider>
  );
};

export {
  ApiContext,
  ApiProvider,
  useApi,
}