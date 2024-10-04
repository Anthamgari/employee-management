// setup-firebase-roles.ts
import * as admin from 'firebase-admin';
import * as serviceAccount from '../src/serviceAccountKey.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

async function setUserRoles() {
    try {
        // Set admin role
        const adminUser = await admin.auth().getUserByEmail('admin@test.com');
        await admin.auth().setCustomUserClaims(adminUser.uid, { role: 'admin' });

        // Set manager role
        const managerUser = await admin.auth().getUserByEmail('manager@test.com');
        await admin.auth().setCustomUserClaims(managerUser.uid, { role: 'manager' });

        // Set employee role
        const employeeUser = await admin.auth().getUserByEmail('employee@test.com');
        await admin.auth().setCustomUserClaims(employeeUser.uid, { role: 'employee' });

        console.log('Roles set successfully');
        process.exit();
    } catch (error) {
        console.error('Error setting roles:', error);
        process.exit(1);
    }
}

setUserRoles();