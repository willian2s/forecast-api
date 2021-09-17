import * as HTTPUtil from '@src/util/request';
import { StormGlass } from '@src/clients/stormGlass';
import stormglassWeatherPointFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import CacheUtil from '@src/util/cache';

jest.mock('@src/util/request');
jest.mock('@src/util/cache');

describe('StormGlass client', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const MockedCacheUtil = CacheUtil as jest.Mocked<typeof CacheUtil>;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;
  it('Return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: stormglassWeatherPointFixture,
    } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedResponseFixture);
  });

  it('Exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);
    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it('Get the normalized forecast points from cache and use it to return data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: null,
    } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(stormGlassNormalizedResponseFixture);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedResponseFixture);
  });

  it('Get a generic error from the StormGlass service when the request fails before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });
    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('Get as StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate limit reached'] },
      },
    });
    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass Service: Error: {"errors":["Rate limit reached"]} Code: 429'
    );
  });
});
