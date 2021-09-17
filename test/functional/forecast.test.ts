import nock from 'nock';
import { Beach, GeoPosition } from '@src/models/beach';
import stormglassWeatherPointFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import apiForecastResponse1beach from '@test/fixtures/api_forecast_response_1_beach.json';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Forecast functional tests', () => {
  const defaultUser: User = {
    name: 'John Doe',
    email: 'john3@mail.com',
    password: '1234',
  };
  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
      userId: user.id,
    };
    await new Beach(defaultBeach).save();
    token = AuthService.generateToken(user.toJSON());
  });

  it('Return a forecast with just a few time', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
        end: /(.*)/,
      })
      .reply(200, stormglassWeatherPointFixture);

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1beach);
  });

  it('Return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v1/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest
      .get(`/forecast`)
      .set({ 'x-access-token': token });

    expect(status).toBe(500);
  });
});
