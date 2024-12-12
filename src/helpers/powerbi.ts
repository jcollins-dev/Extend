interface TokenResponse {
  token: string;
}

type EmbedReport = { embedUrl: string; token: string };

export interface PowerBiWorkspace {
  id: string;
  isReady: boolean;
  isOnDedicatedCapacity: boolean;
  name: string;
}

export interface PowerBiReport {
  datasetId: string;
  datasetWorkspaceId: string;
  embedUrl: string;
  id: string;
  isFromPbix: boolean;
  isOwnedByMe: boolean;
  name: string;
  reportType: string;
  subscriptions: string[];
  users: string[];
  webUrl: string;
}

interface WorkspaceResponse {
  value: PowerBiWorkspace[];
}

interface ReportsResponse {
  value: PowerBiReport[];
}

const workspacesUrl =
  process.env.REACT_APP_POWER_BI_WORKSPACES_URL || 'https://api.powerbi.com/v1.0/myorg/groups';

export async function generateEmbedToken(
  accessToken: string,
  reportId: string,
  workspaceId: string
): Promise<string> {
  const generateEmbedTokenUrl = `${workspacesUrl}/${workspaceId}/reports/${reportId}/GenerateToken`;
  const auth = 'Bearer ' + accessToken;

  const headers: HeadersInit = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', auth);
  headers.set('Accept', 'application/json');

  const generateEmbedTokenOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      accessLevel: 'View',
      allowSaveAs: 'false'
    })
  };

  try {
    const embedTokenResponse = await fetch(generateEmbedTokenUrl, generateEmbedTokenOptions);
    if (!embedTokenResponse.ok) {
      console.error(
        `Failed to fetch embedded report. Status: ${embedTokenResponse.status} ${embedTokenResponse.statusText}`
      );
      return 'ERROR';
    }

    const embedToken: TokenResponse = await embedTokenResponse.json();
    return embedToken.token;
  } catch (error) {
    console.error(`Error fetching embedded report. Status: ${error}`);
    return 'ERROR';
  }
}

export async function getWorkspaces(accessToken: string): Promise<PowerBiWorkspace[]> {
  const auth = 'Bearer ' + accessToken;

  const workspacesOptions = {
    method: 'GET',
    headers: {
      authorization: auth
    }
  };

  try {
    const workspacesResponse = await fetch(workspacesUrl, workspacesOptions);
    if (!workspacesResponse.ok) {
      console.error(
        `Failed to fetch workspaces. Status: ${workspacesResponse.status} ${workspacesResponse.statusText}`
      );
    }

    const workspaces: WorkspaceResponse = await workspacesResponse.json();
    return workspaces.value;
  } catch (error) {
    console.error(`Error fetching workspaces. Status: ${error}`);
  }
  return [];
}

export async function getReports(
  accessToken: string,
  workspaceId: string
): Promise<PowerBiReport[]> {
  const reportsUrl = `${workspacesUrl}/${workspaceId}/reports`;
  const auth = 'Bearer ' + accessToken;

  const requestOptions = {
    method: 'GET',
    headers: {
      authorization: auth
    }
  };

  try {
    const reportsResponse = await fetch(reportsUrl, requestOptions);
    if (!reportsResponse.ok) {
      console.error(
        `Failed to fetch reports. Status: ${reportsResponse.status} ${reportsResponse.statusText}`
      );
    }

    const reports: ReportsResponse = await reportsResponse.json();
    return reports.value;
  } catch (error) {
    console.error(`Error fetching reports. Status: ${error}`);
  }
  return [];
}

export const getEmbedUrl = (reportId: string): string => {
  return `https://app.powerbi.com/reportEmbed?reportId=${reportId}&autoAuth=true&ctid`;
};

export const getEmbedReport = async (
  accessToken: string,
  reportId: string,
  workspaceId: string
): Promise<EmbedReport> => {
  return {
    embedUrl: getEmbedUrl(reportId),
    token: await generateEmbedToken(accessToken, reportId, workspaceId)
  };
};
