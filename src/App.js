import React, {useState} from 'react'
import {Col, Row} from 'antd'
import { Select, Button, Alert, Card, Typography, Space } from 'antd';
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_WEEKEND_API_BASE_URL

const { Text } = Typography

const citiesData = [{code: "SG", name: "Singapore"}, {"code": "BA", name: "Bali", disabled: true}]
const activitiesData = [{code: "FUN_THINGS", desc: "Fun things to do this weekend."}, {code: "CAFE_HOPPING", desc: "Best new cafe in town.", disabled: true}]

const renderSelection = (handleActivityChange, handleCityChange, onSearch, loading) => {
  return <Row gutter={8}>
    <Col xs={12} span={8}>
      <Select
          defaultValue={activitiesData[0]}
          style={{
            width: '100%',
          }}
          onChange={handleActivityChange}
          options={activitiesData.map((activity) => ({
            label: activity.desc,
            value: activity.code,
            disabled: activity.disabled
          }))}
        />
    </Col>
    <Col xs={6} span={8}>
      <Select
          style={{
            width: '100%',
          }}
          onChange={handleCityChange}
          options={citiesData.map((city) => ({
            label: city.name,
            value: city.code,
            disabled: city.disabled,
          }))}
        />
    </Col>
    <Col xs={6} span={8}>
      <Button type="primary" loading={loading} iconPosition="end" onClick={onSearch}>
        {loading ? "Loading" : "Go"}
      </Button></Col>
  </Row>
}
function App() {
  const [cityData, setCity] = useState()
  const [activityData, setActivity] = useState("FUN_THINGS")
  const [loading, setLoading] = useState(false)
  const [weekendData, setWeekendData] = useState()
  const [error, setError] = useState()

  const handleActivityChange = (value) => {
    console.log('activity ', value)
    setActivity(value)
  }
  const handleCityChange = (value) => {
    setCity(value)
  }

  const onSearch = () => {
    console.log(cityData, activityData)
    setLoading(true)
    axios.get(`/fun_things?city=${cityData}&activity=${activityData}`)
      .then((resp) => {
        setWeekendData(resp.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError("Something went wrong")
      })
  }
  return (
    <div className="App">
      <header style={{width: "100%", height: "30%"}}>&nbsp;</header>
      <div className="container">
        <Row>
          <Col xs={2} lg={6}></Col>
          <Col xs={20} lg={12}>
            {renderSelection(handleActivityChange, handleCityChange, onSearch, loading)}
          </Col>
          <Col xs={2} lg={6}></Col>
        </Row>
        <Row style={{marginTop: "20px"}}>
          <Col xs={2} lg={6}></Col>
          <Col xs={20} lg={12}>
            <div>{!!error && <Alert message={error} type="error" showIcon />}</div>
            {weekendData && <div>
              <p style={{padding: "10px"}}>{weekendData.summary}<br/><i style={{color: "#666", fontSize: "12px", paddingTop: "10px"}}>source: {weekendData.source}</i></p>
              </div>}
            <Row gutter={16}>
              {!!weekendData && weekendData.activities.map(data => {
                return <Col span={8} className="gutter-row" xs={24} sm={12} lg={8}>
                  <Card title={data.title} bordered style={{marginBottom: '10px'}}>
                    <p>{data.description}</p>
                    <div style={{fontSize: "13px"}}>
                      <div><span>🗓️</span>: <Text>{data.date}</Text></div>
                      <div><span>📍</span>: <Text>{data.location}</Text></div>
                      <div><span>🎟️</span>: <Text>{data.ticket ? data.ticket : "Free"}</Text></div>
                    </div>
                  </Card>
                </Col>
              })}
            </Row>
          </Col>
          <Col xs={2} lg={6}>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
