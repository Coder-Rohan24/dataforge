// import React, { useState } from 'react';
// import { deployModel } from '../api';

// const DeployPage = () => {
//   const [modelName, setModelName] = useState('');
//   const [result, setResult] = useState(null);

//   const handleDeploy = async () => {
//     const res = await deployModel(modelName);
//     setResult(res.data);
//   };

//   return (
//     <div>
//       <h2>Deploy Model</h2>
//       <input
//         type="text"
//         placeholder="Model name"
//         value={modelName}
//         onChange={(e) => setModelName(e.target.value)}
//       />
//       <button onClick={handleDeploy}>Deploy</button>
//       {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
//     </div>
//   );
// };

// export default DeployPage;
