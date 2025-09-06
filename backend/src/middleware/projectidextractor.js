
//// This middleware is extracting project id 
function projectidextractor(req, res, next) {
  // Extrating project id fromt the request 
  const projectidfromfrontend = req.get('project-id');
  if (!projectidfromfrontend) {
    return res.status(400).json({ message: 'projectid missing' });
  }
//Front end is sending the projectid as string 
//in here we are converting it to Int for passing on to the database
  const projectId = Number(projectidfromfrontend);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(400).json({ message: 'projectid must be a positive integer' });
  }
  console.log('project-id header received:', projectidfromfrontend);
  console.log('projectId parsed as number:', projectId);

  req.projectId = projectId;
  return next();
}
export default projectidextractor;
