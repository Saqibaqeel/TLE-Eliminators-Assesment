const express = require('express');
const router = express.Router();
const {fetchAndSaveContests,getAllContests,getContesByPlatForm,updateUrl,solutionUrl }=require('../controllers/contestController')
//  router.get('/fetchAndSave',fetchAndSaveContests);
    router.get('/',getAllContests);
    router.get('/view/solutionurl/:id',solutionUrl);
    router.get('/:platform',getContesByPlatForm);
    router.put('/update/:contestId', updateUrl);

   
  
module.exports = router;