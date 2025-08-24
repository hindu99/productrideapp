
import { getAllProjects } from '../../models/projectquerymodel/projectquerymodel.js';

/*This controller get the request to populate the projects,it get's the tenantId
from JWT and then pass this tenantID to the projctquery model to get the project details 
then pass the projects given out by the model to the fromtned*/

export const getallprojects = async (req, res) => {
  try {
    // tenantId could come from auth token, session, or request params
    const tenantId = req.user?.tenantId || req.query.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Unauthorised request' });
    }

    //passing the tenantId to the getAllProjects fucntion from the projectquery model,to get te result from database
    const projects = await getAllProjects(tenantId);
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
