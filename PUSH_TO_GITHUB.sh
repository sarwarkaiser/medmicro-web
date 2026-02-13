#!/bin/bash

#####################################################################
# Push MedMicro PWA to GitHub from Your Mac
# Run this script on your Mac after copying the project files
#####################################################################

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Push MedMicro PWA to GitHub                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Are you in the medmicro directory?${NC}"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    git branch -M main
fi

# Add all files
echo -e "${BLUE}Adding files to git...${NC}"
git add -A

# Create commit if needed
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${GREEN}✓ All files already committed${NC}"
else
    echo -e "${BLUE}Creating commit...${NC}"
    git commit -m "Initial commit: MedMicro PWA

- Express server with REST API
- Progressive Web App with offline support
- 11 medications, 9 clinical guidelines, 5 DSM-5 criteria
- Clinical calculators (PHQ-9, GAD-7, BMI)
- Oracle Cloud deployment automation
- Cloudflare HTTPS setup documentation
- Installable on Android, iOS, desktop

https://github.com/sarwarkaiser/medmicro-web"
    echo -e "${GREEN}✓ Commit created${NC}"
fi

# Add remote
echo -e "${BLUE}Adding GitHub remote...${NC}"
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/sarwarkaiser/medmicro-web.git
echo -e "${GREEN}✓ Remote added${NC}"

# Push to GitHub
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✓ Successfully pushed to GitHub!                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}\n"

    echo -e "${BLUE}View your repository:${NC}"
    echo -e "${GREEN}https://github.com/sarwarkaiser/medmicro-web${NC}\n"
else
    echo -e "\n${YELLOW}If push failed, you may need to authenticate with GitHub.${NC}"
    echo -e "${YELLOW}Run: gh auth login${NC}"
    echo -e "${YELLOW}Or configure your GitHub credentials.${NC}\n"
fi
