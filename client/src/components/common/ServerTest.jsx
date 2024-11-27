import { useState, useEffect } from 'react';
import getHealth from '../../services/test.api.js';
import logger from '../../../config/logger.js';
import FontAwesomeIcon from './Icon.jsx';

function ServerTest() {
  const [status, setStatus] = useState({
    message: '',
    type: '',
  });

  const checkServerStatus = async () => {
    try {
      logger.info('Checking server status');
      const data = await getHealth();
      logger.info('Server response:', data);
      setStatus({
        message: `Server is ${data.status}`,
        type: 'success',
      });
    } catch (err) {
      logger.error('Server error:', err);
      setStatus({
        message: err.message,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  <FontAwesomeIcon icon="fa-server" className="mr-2" />
                  Server Status
                </h2>

                <div className="mt-4 min-h-[80px]">
                  {status.message && (
                    <div
                      className={`${
                        status.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                      } p-4 rounded-md`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FontAwesomeIcon
                            icon={
                              status.type === 'success'
                                ? 'fa-circle-check'
                                : 'fa-circle-exclamation'
                            }
                            className={`h-5 w-5 ${
                              status.type === 'success'
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          />
                        </div>
                        <div className="ml-3">
                          <p
                            className={`text-sm font-medium ${
                              status.type === 'success'
                                ? 'text-green-800'
                                : 'text-red-800'
                            }`}
                          >
                            {status.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={checkServerStatus}
                  className="mt-4 w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-md px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  <FontAwesomeIcon icon="fa-rotate" className="mr-2" />
                  Check Server Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerTest;
