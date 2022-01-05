import { renderFile } from "https://deno.land/x/dejs@0.10.2/mod.ts";
import { GitHubClient, LinkedInClient, GoogleClient } from 'https://deno.land/x/denoauth@v1.0.0/mod.ts'
import pogo from 'https://deno.land/x/pogo/main.ts';

const server = pogo.server({ port : 3000 });


const GitHubObject = new GitHubClient({
    clientId: '8d769a8e565111f853fb',
    clientSecret: "338d114ea503daf91ce92c4fbd18a21927d82970",
    tokenUri: 'https://github.com/login/oauth/access_token',
    redirect: "http://localhost:3000/auth/github/callback",
    scope: "read:user"
});

const LinkedInObject = new LinkedInClient({
    clientId: '8693ww7e9p6u3t',
    clientSecret: 'LSX8D4d74EyR8c35',
    tokenUri: 'https://api.linkedin.com/v2/me',
    redirect: 'http://localhost:3000/auth/linkedin/callback',
    scope: 'r_liteprofile'
});

const GoogleObject = new GoogleClient({
    clientId: '355975710617-pu1n5okl8jpuh9ofqnclji3bqk6gk88o.apps.googleusercontent.com',
    clientSecret: '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',
    tokenUri: 'https://accounts.google.com/o/oauth2/token',
    redirect: 'http://localhost:3000/auth/google/callback',
    scope: 'https://mail.google.com&access_type=offline&include_granted_scopes=true'
});


server.router.get('/login', async (request, h) => {
    const buffer = await Deno.readFile('./login.html');
    return h.response(buffer);
});

server.router.get('/gitHub', (request, h) => {
   return h.redirect(GitHubObject.code.createLink())
})

server.router.get('/linkedin', (request, h) => {
   return h.redirect(LinkedInObject.code.createLink())
})
  
server.router.get('/google', (request, h) => {
   return h.redirect(GoogleObject.code.createLink())
})

server.router.get('/auth/github/callback', async (request, h) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GitHubObject.code.processAuth(request.url);
    // userProfile is an object of information given by GitHub. You can destructure the object to grab specific information
    const { name } = userProfile;
    
    return (`Hello, ${name}!`);
})

server.router.get('/auth/linkedin/callback', async (request, h) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await LinkedInObject.code.processAuth(request.url);
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    const {localizedFirstName} = userProfile;

     return (`Hello ${localizedFirstName}`);
})


server.router.get('/auth/google/callback', async (request, h) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GoogleObject.code.processAuth(request.url);
    // userProfile is an object of information given by Google. 
    //You can destructure the object to grab specific information once the app has been verified
    return (`Hello, this is where your secret page lives`);
})

server.router.get('/', () => {
    return 'Hello, world!';
});

server.start();

console.log("http://localhost:3000/");