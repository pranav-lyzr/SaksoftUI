// interface ApiResponse {
//   data: string;
//   error?: string;
// }

// const PROJECT_ID = '67c550eeb9e1f13c1e315f57';

// export async function codeSearch(message: string): Promise<ApiResponse> {
//   try {
//     const response = await fetch('http://localhost:8000/code_search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ message, project_id: PROJECT_ID }),
//     });
//     console.log("THis is the response", response)
//     if (!response.ok) {
//       const errorData = await response.json();
//       return { 
//         data: '', 
//         error: errorData.detail ? JSON.stringify(errorData.detail) : 'Failed to fetch response' 
//       };
//     }

//     const { response: apiResponse, module_outputs } = await response.json();
//     console.log("this is response",response);
//     // Handle cases where module_outputs is empty
//     if (!module_outputs || Object.keys(module_outputs).length === 0) {
//       return { data: apiResponse || 'No relevant results found.' };
//     }

//     return { data: JSON.stringify(module_outputs, null, 2) };
//   } catch (error) {
//     console.error('API call failed:', error);
//     return { 
//       data: '', 
//       error: 'Failed to connect to API. Make sure the server is running.' 
//     };
//   }
// }

// export async function codeGenerate(message: string): Promise<ApiResponse> {
//   try {
//     const response = await fetch('http://localhost:8000/code_generate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ message, project_id: PROJECT_ID }),
//     });
//     console.log("THis is the response", response)

//     if (!response.ok) {
//       const errorData = await response.json();
//       return { 
//         data: '', 
//         error: errorData.detail ? JSON.stringify(errorData.detail) : 'Failed to fetch response' 
//       };
//     }

//     const { response: apiResponse, module_outputs } = await response.json();
//     console.log("this is response",response);

//     // Handle cases where module_outputs is empty
//     if (!module_outputs || Object.keys(module_outputs).length === 0) {
//       return { data: apiResponse || 'No relevant results found.' };
//     }

//     return { data: JSON.stringify(module_outputs, null, 2) };
//   } catch (error) {
//     console.error('API call failed:', error);
//     return { 
//       data: '', 
//       error: 'Failed to connect to API. Make sure the server is running.' 
//     };
//   }
// }
interface ApiResponse {
  data: string;
  error?: string;
}

// API configuration constants
const USER_ID = 'pranav@lyzr.ai';
const CODE_SEARCH_AGENT_ID = '67c556420606a0f240481e79';
const CODE_GENERATE_AGENT_ID = '67c55dfe8cfac3392e3a4eb0';
const API_KEY = 'sk-default-yStV4gbpjadbQSw4i7QhoOLRwAs5dEcl';

export async function codeSearch(message: string): Promise<ApiResponse> {
  try {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: CODE_SEARCH_AGENT_ID,
        session_id: CODE_SEARCH_AGENT_ID,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        data: '', 
        error: errorData.detail ? JSON.stringify(errorData.detail) : 'Failed to fetch response' 
      };
    }

    const responseData = await response.json();
    return { data: responseData.response };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      data: '', 
      error: 'Failed to connect to API. Make sure the server is running.' 
    };
  }
}

export async function codeGenerate(message: string): Promise<ApiResponse> {
  try {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: CODE_GENERATE_AGENT_ID,
        session_id: CODE_GENERATE_AGENT_ID,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        data: '', 
        error: errorData.detail ? JSON.stringify(errorData.detail) : 'Failed to fetch response' 
      };
    }

    const responseData = await response.json();
    return { data: responseData.response };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      data: '', 
      error: 'Failed to connect to API. Make sure the server is running.' 
    };
  }
}