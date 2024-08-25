import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useAxios } from "./useAxios";
import { message } from "antd";

interface UsePostProps {
  onSuccess: (data: any) => void;
  endpoint: string;
  values?: any;
}

const usePost = ({ onSuccess, endpoint, values }: UsePostProps) => {
  const api = useAxios();

  const mutation: UseMutationResult<any, AxiosError<any>, any> = useMutation({
    mutationFn: async (values: any) => {
      const response: AxiosResponse = await api.post(endpoint, values);
      return response.data;
    },
    retry: 2,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: AxiosError<any>) => {
      let title = "Request failed";

      if (error.response) {
        const { status, data } = error.response;
        const keys = Object.keys(data);
    
        // Check for 400 Bad Request errors
        if (status === 400 && keys.length > 0) {
          // Display each error message in a separate notification
          keys.forEach((key) => {
            const errorMessages = data[key]; // Assuming `data[key]` is an array of error messages
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach((messageText) => {
                message.error(`${key}: ${messageText}`);
                console.log(`${key}: ${messageText}`);
              });
            } else {
              message.error(`${key}: ${errorMessages}`);
            }
          });
        }
    
        // Handle 404 error with a single notification
        if (status === 404) {
          title = "Page not found";
          const messageText = data.detail || "The requested resource could not be found.";
          message.error(`${title}: ${messageText}`);
        }
      } else {
        // Default error handling for other cases
        message.error(error.message);
      }
    
      // Log the error
      console.error(`${title}: ${error.message}`);
    },
  });

  // Access isLoading from the mutation result
  const { mutate, status } = mutation;
  const isLoading = status ===  'pending'; // React-query uses `status` to track loading

  return { mutate, isLoading };
};

export default usePost;
