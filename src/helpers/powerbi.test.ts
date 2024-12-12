// 3rd party
import fetchMock from 'jest-fetch-mock';

// Helper functions to test
import {
  generateEmbedToken,
  getReports,
  getWorkspaces,
  getEmbedUrl,
  getEmbedReport
} from 'helpers';

describe('Power BI helpers - helpers', () => {
  const testAccessToken = '123456';
  const testEmbedToken = '567890';
  const testReportId = 'k1a2v3';
  const testWorkspaceId = 'c0l9a8';
  const testWorkspaces = {
    value: [
      {
        id: 'f089354e-8366-4e18-aea3-4cb4a3a50b48',
        isReadOnly: false,
        isOnDedicatedCapacity: false,
        name: 'veggie group'
      },
      {
        id: '3d9b93c6-7b6d-4801-a491-1738910904fd',
        isReadOnly: false,
        isOnDedicatedCapacity: false,
        name: 'meat group'
      },
      {
        id: 'a2f89923-421a-464e-bf4c-25eab39bb09f',
        isReadOnly: false,
        isOnDedicatedCapacity: false,
        name: 'omni group',
        dataflowStorageId: 'd692ae06-708c-485e-9987-06ff0fbdbb1f'
      }
    ]
  };
  const testReports = {
    value: [
      {
        datasetId: 'dataset12345',
        datasetWorkspaceId: 'dataset-workspace-id-12345',
        embedUrl:
          'https://app.powerbi.com/reportEmbed?reportId=exampleid&groupId=exampleid&w=somethingsecret',
        id: 'report-id-12345',
        isFromPbix: true,
        isOwnedByMe: true,
        name: 'report-name-12345',
        reportType: 'PowerBIReport',
        subscriptions: [],
        users: [],
        webUrl: 'https://app.powerbi.com/groups/someid/reports/somereportid'
      }
    ]
  };

  beforeEach(() => {
    fetchMock.doMock();
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes('api.powerbi.com') && req.url.includes('GenerateToken')) {
        return Promise.resolve(JSON.stringify({ ok: true, token: testEmbedToken }));
      } else if (req.url.includes('api.powerbi.com') && req.url.includes('/reports')) {
        return Promise.resolve(JSON.stringify({ ...testReports }));
      } else if (req.url.includes('api.powerbi.com') && req.url.includes('/groups')) {
        return Promise.resolve(JSON.stringify({ ...testWorkspaces }));
      }
      return Promise.reject(new Error('bad URL'));
    });
  });

  it('It should return the expected embed token', async () => {
    const embedToken = await generateEmbedToken(testAccessToken, testReportId, testWorkspaceId);
    expect(embedToken).toBe(testEmbedToken);
  });

  it('It should return the expected workspaces', async () => {
    const workspaces = await getWorkspaces(testAccessToken);
    expect(workspaces[0].name).toBe('veggie group');
  });

  it('It should return the expected reports', async () => {
    const reports = await getReports(testAccessToken, testReportId);
    expect(reports[0].name).toBe('report-name-12345');
  });

  it('It should return the expected embed URL', async () => {
    const url = getEmbedUrl(testReportId);
    expect(url).toBe(
      `https://app.powerbi.com/reportEmbed?reportId=${testReportId}&autoAuth=true&ctid`
    );
  });

  it('It should return the expected embed URL', async () => {
    const embedDetails = await getEmbedReport(testAccessToken, testReportId, testWorkspaceId);
    expect(embedDetails.token).toBe(testEmbedToken);
    expect(embedDetails.embedUrl).toBe(
      `https://app.powerbi.com/reportEmbed?reportId=${testReportId}&autoAuth=true&ctid`
    );
  });
});
