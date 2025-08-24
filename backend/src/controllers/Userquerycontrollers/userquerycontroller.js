// backend/src/controllers/userController.js
import { getAllUsersModel } from '../../models/Userquerymodels/userquerymodel.js';

/*This controller get the request to populate the users,it get's the tenantId
from JWT and then pass this tenantID to the userquerymodel.js to get the user details 
then pass the users given out by the model to the frontned*/

export const getAllUsers = async (req, res) => {
  try {
    // tenantId could come from auth token, session, or request params
    const tenantId = req.user?.tenantId || req.query.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Unauthorised request' });
    }

     //passing the tenantId to the getAllUserModel fucntion from the userquerymodel,to get te result from database
    const users = await getAllUsersModel(tenantId);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
