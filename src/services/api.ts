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

export async function codeSearch(
  message: string,
  onChunk: (chunk: string) => void
): Promise<ApiResponse> {
  try {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/stream/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: CODE_SEARCH_AGENT_ID,
        session_id: CODE_SEARCH_AGENT_ID,
        message,
        stream: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        data: '', 
        error: errorData.detail ? JSON.stringify(errorData.detail) : 'Failed to fetch response' 
      };
    }

    let fullResponse = '';

    // Create a new ReadableStream from the response body
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      // Split the chunk into individual SSE data lines
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Remove 'data: ' prefix
          if (data === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.response) {
              fullResponse += parsed.response;
              onChunk(parsed.response);
            }
          } catch (e) {
            // If not JSON, send the raw data
            if (data.trim()) {
              fullResponse += data;
              onChunk(data);
            }
          }
        }
      }
    }

    return { data: fullResponse };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      data: '', 
      error: 'Failed to connect to API. Make sure the server is running.' 
    };
  }
}

export async function codeGenerate(
  message: string,
  onChunk: (chunk: string) => void
): Promise<ApiResponse> {
  try {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/stream/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: CODE_GENERATE_AGENT_ID,
        session_id: CODE_GENERATE_AGENT_ID,
        message,
        stream: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        data: '', 
        error: errorData.detail ? JSON.stringify(errorData.detail) : 'Failed to fetch response' 
      };
    }

    let fullResponse = '';

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Remove 'data: ' prefix
          if (data === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.response) {
              fullResponse += parsed.response;
              onChunk(parsed.response);
            }
          } catch (e) {
            // If not JSON, send the raw data
            if (data.trim()) {
              fullResponse += data;
              onChunk(data);
            }
          }
        }
      }
    }

    return { data: fullResponse };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      data: '', 
      error: 'Failed to connect to API. Make sure the server is running.' 
    };
  }
}