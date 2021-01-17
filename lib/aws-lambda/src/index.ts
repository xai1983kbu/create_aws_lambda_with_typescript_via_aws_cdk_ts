import axios from 'axios';

export const handler = async (event: unknown): Promise<unknown> => {
    const result = await axios.get(
        'https://jsonplaceholder.typicode.com/todos'
    );
    // console.log(result.data);
    return {
        statusCode: 200,
        body: JSON.stringify({ event: event, result: result.data })
    };
};
