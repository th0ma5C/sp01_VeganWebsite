const { exec } = require('child_process');

const command = `cd C:\\Users\\thoma\\OneDrive\\桌面\\SideProject\\veganOfficialWeb; npm run dev`;

module.exports = () => {
    return exec(`start powershell.exe -NoExit -Command "${command}"`, (error) => {
        if (error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.log('vite started');
        }
    });
}

