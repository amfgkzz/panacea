import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import axios from 'axios';
import './MapPage.css';
import { Grid, Typography, Checkbox, FormControlLabel, IconButton, SvgIcon } from '@material-ui/core/';
import BackButton from '@material-ui/icons/ChevronLeftRounded';

function MapPage(props) {

  const { cityName } = props.match.params;
  const [organizations, setOrganizations] = useState([]);
  const [showOrganization, setOrganizationToShow] = useState([]);
  const [lat, setLat] = useState(props.location.coordinates?props.location.coordinates.lat:0);
  const [lng, setLng] = useState(props.location.coordinates?props.location.coordinates.lng:0);
  const [infoWindow, setInfoWindow] = useState(null);
  const [zoom, setZoom] = useState(11);

  const markerClicked = (key, props) => {
    const { lat, lng } = props;
    setLat(Number(lat));
    setLng(Number(lng));
    return setZoom(13);
  }

  const markerOpen = (e) => {
    const { id } = e.currentTarget;
    setOrganizationToShow(organizations.filter((org) => {
      return org.id == id;
    }))
  }

  const markerClose = (e) => {
    return setOrganizationToShow([]);
  }

  const showInfoWindow = (e) => {
    return setInfoWindow(e.currentTarget.id);
  }

  const resetZoom = (e) => {
    setInfoWindow(null);
    return setZoom(11);
  }

  useEffect(() => {

    async function fetchOrganizations() {
      try {
        const { data } = await axios.get(`/api/public/map?city_id=${props.location.city_id}&orgType=${props.location.orgType}`);
        setOrganizations(data);
      } catch (error) {
        console.log('Error with request: ', error);
      }
    }

    if (props.location.city_id) {
      fetchOrganizations();
    }

  }, []);

  if (props.location.city_id) {
    return (
      <>

        <div className="container">
          <div className="back-button">
            <IconButton onClick={
              props.history.goBack
            } style={{
              backgroundColor: `#6AA4DA`, 
              boxShadow: `.5px 0px 1px 0px black`
            }}>
              <BackButton style={{ color: `white` }}/>
            </IconButton>
          </div>
          
          <GoogleMapReact
            bootstrapURLKeys={{
              // TODO: restrict key later
              key: 'AIzaSyD1LKqeIf7_dF7UhVc9JGzNbo_vUM3gOjE',
              language: 'en'
            }}
            center={{ lat: lat, lng: lng }}
            zoom={zoom}
            layerTypes={['TrafficLayer', 'TransitLayer']}
            options={{ clickableIcons: false }}
            onChildClick={markerClicked}
          >

            {organizations.map((organization, i) => {
              return (
                <Marker
                  key={i}
                  infoWindow={infoWindow}
                  showInfoWindow={showInfoWindow}
                  resetZoom={resetZoom}
                  showOrganizationClick={markerOpen}
                  cityName={cityName}
                  {...organization}
                />
              )
            })}

          </GoogleMapReact>

        </div>

        {/* adult: false
adult_surgical: false
childrens: false
childrens_surgical: false
city_id: 1
comments: "Important to be an advocate and have a birth plan and have talked to locals who recommend paying in cash staff to take better care of you otherwise you get minimal attention and lack of supplies.  bring your own supplies for pads, and foods etc for yourself and diapers outfits etc for baby"
created_at: "2019-08-07T17:22:13.674Z"
google_maps_link: "https://www.google.com/maps/place/Szpital+Ginekologiczno-Po%C5%82o%C5%BCniczy+im.+Rafa%C5%82a+Czerwiakowskiego/@50.0692737,19.930189,17z/data=!3m1!4b1!4m5!3m4!1s0x47165b0649eb0a4f:0x90f06b0b4a997bb9!8m2!3d50.0692737!4d19.9323777"
homeopathic_remedies: "none"
hours: "Open 24 hours"
id: 3
labor_delivery: true
lat: "50.069313"
lng: "19.932438"
medical_translators: false
name: "Szpital Ginekologiczno-Położniczy im. Rafała Czerwiakowskiego"
phone_number: "+48 12 634 22 22"
recommended: true
twentyfour: true
type: "Hospital"
website_url: "https://www.su.krakow.pl/" */}

        {
          showOrganization.length > 0
            ?
            <>

              <div className="organization-list">

              {/* TODO: FIX THE CLOSE, IT TAKES UP A 100% OF THE WIDTH, MEANING DON'T HAVE TO CLICK X TO CLOSE */}
                <IconButton
                  onClick={markerClose}
                >
                  <SvgIcon style={{ color: `#F96F9D`}}>
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
                  </SvgIcon>
                </IconButton>

                <Grid container spacing={1} item xs={12}
                  style={{ margin: `0px 20px`, width: `90vw` }} >

                  <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '5px' }}>
                    <a target="_blank" 
                      href={showOrganization[0].website_url}
                      style={{ textDecoration: `underline` }}
                    >
                      {showOrganization[0].name}
                    </a>
                  </Grid>

                  <Grid item xs={12}>
                    Phone Number: {showOrganization[0].phone_number}
                  </Grid>

                  <Grid item xs={12}>
                    Hours: {showOrganization[0].hours}
                  </Grid>

                  <Grid item xs={12}>
                    Comments: {showOrganization[0].comments}
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="recommended"
                          color="primary"
                          checked={showOrganization[0].recommended}
                        />
                      }
                      label="Recommended"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="twentyfour"
                          color="primary"
                          checked={showOrganization[0].twentyfour}
                        />
                      }
                      label="Open 24 Hours"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="labor_delivery"
                          color="primary"
                          checked={showOrganization[0].labor_delivery}
                        />
                      }
                      label="Labor and Delivery Available"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="childrens"
                          color="primary"
                          checked={showOrganization[0].childrens}
                        />
                      }
                      label="Pediatric Services"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="childrens_surgical"
                          color="primary"
                          checked={showOrganization[0].childrens_surgical}
                        />
                      }
                      label="Surgical Pediatric Services"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="adult"
                          color="primary"
                          checked={showOrganization[0].adult}
                        />
                      }
                      label="Adult Medicine"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="adult_surgical"
                          color="primary"
                          checked={showOrganization[0].adult_surgical}
                        />
                      }
                      label="Adult Surgical Services"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="medical_translators"
                          color="primary"
                          checked={showOrganization[0].medical_translators}
                        />
                      }
                      label="Medical Translators Available"
                      style={{ width: '180px', marginLeft: '0px' }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <a target="_blank" 
                      href={showOrganization[0].google_maps_link}
                      style={{ textDecoration: `underline` }}
                    >
                      Directions
                      </a>
                  </Grid>

                </Grid>

              </div>
            </>
            :
            <>
            </>
        }

      </>
    )
  } else {
    return (
      <h1>
      404
      </h1>
    )
  }


}

export default (MapPage);