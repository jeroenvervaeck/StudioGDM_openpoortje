import { default as React, useContext, createContext, useState } from 'react';
import { Kid } from '../components';

import { apiConfig } from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  // const BASE_URL = `${apiConfig.baseURL || "http://localhost:8080"}`;
  const BASE_URL = "https://open-poortje-api.herokuapp.com";

  const [ user, setUser ] = useState(JSON.parse(sessionStorage.getItem('user')));

  const colors = {
	  'color-01': '#93B993',
	  'color-02': '#e06e6a',
	  'color-03': '#7ed5e5',
	  'color-04': '#E89BC4',
  }

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

    return response;
  }

  const updateSupervisorData = async () => {
    const auth = JSON.parse(getCookie('sup-auth'));
    const url = `${BASE_URL}/supervisor`;

    const options = {
      method:'GET',
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    sessionStorage.setItem('supervisor', JSON.stringify(response.supervisor));
    setUser(response);

    return response;
  }

  const updateSelectedKidData = async (id) => {
    const auth = JSON.parse(getCookie('sup-auth'));
    const url = `${BASE_URL}/supervisor/kid/${id || JSON.parse(sessionStorage.getItem('selected-kid'))._id}`;

    const options = {
      method:'GET',
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());
    console.log(response);

    sessionStorage.setItem('selected-kid', JSON.stringify(response.kid));
    setUser(response);

    return response;
  }

  const getKidsOfOrganisation = async ( role='supervisor' ) => {
    const auth = (role === 'supervisor') ? JSON.parse(getCookie('sup-auth')) : JSON.parse(getCookie('auth'));
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

  const editAuthKid = async ( kidId, changes ) => {
    console.log(kidId, changes)
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/kid/auth`;

    const body = {
      id: kidId,
      authUpdate: changes,
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

  const newSupervisor = async ( supervisor ) => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/supervisor`;

    const options = {
      method:'POST',
      body: JSON.stringify(supervisor),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const editSupervisor = async ( supervisorId, changes ) => {
    console.log(supervisorId, changes)
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/supervisor`;

    const body = {
      id: supervisorId,
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

  const editAuthSupervisor = async ( supervisorId, changes ) => {
    console.log(supervisorId, changes)
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/supervisor/auth`;

    const body = {
      id: supervisorId,
      authUpdate: changes,
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

  const deleteSupervisor = async ( supervisorId ) => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/organisation/supervisor`;

    const options = {
      method:'DELETE',
      body: JSON.stringify({id: supervisorId}),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  
  const getFicheTypes = async () => {
    const auth = JSON.parse(getCookie('sup-auth'));
    const url = `${BASE_URL}/supervisor/fichetypes`;

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
  const getKidFicheTypes = async () => {
    const auth = JSON.parse(getCookie('auth'));
    const url = `${BASE_URL}/kid/fichetypes`;

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

  const saveMountainFiche = async ( question1, question2, positionById, kidId, screenshot ) => {
    // save screenshot 
    const pictureName = await saveScreenshot(screenshot);

    const auth = JSON.parse(getCookie('sup-auth'));
    const url = `${BASE_URL}/kid/fiche`;
    
    const body = {
      kidId: kidId,
      fiche: {
        fiche_type: "601a996b352c1d313cd7bca2",
        picture_name: pictureName,
        fiche_data:{
          vraag1: question1,
          vraag2: question2,
          positionById: positionById
        }
      }
    }

    const options = {
      method:'POST',
      body:JSON.stringify(body),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const updateMountainFiche = async ( fiches, kidId, newFiche, positionById ) => {
    const newFiches = fiches.map((fiche) => {
      if (fiche.fiche_data != undefined && fiche.fiche_data.positionById === positionById) {
        return newFiche;
      }
      return fiche;
    })
    return editKid(kidId, {fiches: newFiches});
  }

  const saveDialogFiche = async ( questionBlue, questionYellow, questionRed, kidId, screenshot ) => {
    // save screenshot 
    const pictureName = await saveScreenshot(screenshot);

    // save fiche
    const auth = JSON.parse(getCookie('sup-auth'));
    const url = `${BASE_URL}/kid/fiche`;

    const body = {
      kidId: kidId,
      fiche: {
        fiche_type: "603e31d01b09a12647f1c244",
        picture_name: pictureName,
        fiche_data:{
          questionBlue: questionBlue,
          questionYellow: questionYellow,
          questionRed: questionRed
        }
      }
    }

    const options = {
      method:'POST',
      body:JSON.stringify(body),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const saveFiche = async ( kidId, ficheTypeId, screenshot ) => {
    // save screenshot 
    const pictureName = await saveScreenshot(screenshot);

    // save fiche
    const auth = JSON.parse(getCookie('sup-auth'));
    const url = `${BASE_URL}/kid/fiche`;

    const body = {
      kidId: kidId,
      fiche: {
        fiche_type: ficheTypeId,
        picture_name: pictureName,
        fiche_data:{
        }
      }
    }

    const options = {
      method:'POST',
      body:JSON.stringify(body),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const saveMoneyFiche = async ( moneyAmount, kidId, screenshot ) => {
    // save screenshot 
    const pictureName = await saveScreenshot(screenshot);

    // save fiche
    const auth = JSON.parse(getCookie('sup-auth'));
    const url = `${BASE_URL}/kid/fiche`;

    const body = {
      kidId: kidId,
      fiche: {
        fiche_type: "603e31d01b09a12647f1c244",
        picture_name: pictureName,
        fiche_data:{
          moneyAmount: moneyAmount,
        }
      }
    }

    const options = {
      method:'POST',
      body:JSON.stringify(body),
      headers: new Headers({
          'Authorization': 'Bearer '+ auth.token, 
          'Content-Type': 'application/json',
        }), 
    }

    const response = await fetch(url, options).then((result) => result.json());

    return response;
  }

  const saveScreenshot = async ( file, width = 800, height = 600 ) => {
    const data = new FormData();
    data.append('picture', file);
    data.append('width', width);
    data.append('height', height);

    const url = `${BASE_URL}/fiche`;

    const options = {
      method:'POST',
      headers: {
        // 'content-type': 'multipart/form-data'
        }, 
      body: data,
    }

    const response = await fetch(url, options).then((result) => result.json());
    console.log(response)
    return response.filename;
  }

  const getUrl = (route) => {
    return BASE_URL + route;
  }


  return (
    <ApiContext.Provider value={{ 
      user,
      colors,
      
      setCookie,
      getCookie,
      eraseCookie,
      updateUserData,
      updateSelectedKidData,
      updateSupervisorData,

      getKidsOfOrganisation,
      editKid,
      editAuthKid,
      newKid,
      deleteKid,

      getSupervisorsOfOrganisation,
      newSupervisor,
      editSupervisor,
      editAuthSupervisor,
      deleteSupervisor,

      // fiches
      getFicheTypes,
      getKidFicheTypes,
      saveMountainFiche,
      saveDialogFiche,
      updateMountainFiche,
      saveMoneyFiche,
      saveFiche,

      getUrl,
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
