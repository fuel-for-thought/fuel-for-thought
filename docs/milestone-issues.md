# Copy-and-paste milestone issues

Use each heading as the GitHub issue title. Paste the Description and Tasks into the matching fields in the Milestone task form, or paste the full block into a blank issue. Add it to the named project. After creating a new issue, use its actual number in the work branch name, such as `issue-12`.

Checked tasks reflect work verified in the initial M1 commit. M2 is proposed work. Use the [board data](milestone-boards.md) for suggested estimates and enter actual effort from team records.

## M1

### Build the Community landing page

```markdown
## Description

Build the Fuel for Thought landing page using the Community mockup.

## Tasks

- [x] Create the Community feed and sidebar.
- [x] Add search, category filters, and an empty state.
- [x] Verify the landing page in Chromium.
```

### Build four navigable page mockups

```markdown
## Description

Create the four additional screens required for M1.

## Tasks

- [x] Build Find food, My goals, Sign in, and Place details.
- [x] Link the mockups from the navigation or listing cards.
- [x] Verify each route loads.
```

### Build the project home and capture screenshots

```markdown
## Description

Create a project home showing the current state of Fuel for Thought.

## Tasks

- [x] Add GitHub organization and repository links.
- [x] Add the Deployment section.
- [x] Capture and display five screenshots.
```

### Deploy the M1 application to Vercel

```markdown
## Description

Publish the M1 prototype to a production Vercel URL.

## Tasks

- [ ] Import the repository and deploy the main branch.
- [ ] Open the production URL and verify the landing page and mockup routes.
- [ ] Record the production URL.
```

### Complete project home links and verify hosting

```markdown
## Description

Finish the project home so graders can access the required milestone materials.

## Tasks

- [ ] Add the approved Team Contract and Vercel links.
- [ ] Add links to the M1 and M2 project boards.
- [ ] Check the course hosting guidelines and verify access in a private window.
```

### Verify M1 issue tracking and effort records

```markdown
## Description

Complete the course tracking requirements for the first milestone.

## Tasks

- [ ] Assign each issue to its owner and record estimates and estimators.
- [ ] Record actual coding and non-coding effort from team records.
- [ ] Verify issue branches and linked pull requests. Close completed issues and confirm M1 status.
```

## M2

### Set up persistent storage for listings and posts

```markdown
## Description

Store food listings and community posts so they survive a reload.

## Tasks

- [ ] Define records for listings and posts.
- [ ] Add sample data for local development.
- [ ] Verify that saved records can be read after reload.
```

### Implement student sign-in and sign-out

```markdown
## Description

Let students sign in so they can use account-specific features.

## Tasks

- [ ] Add sign-in and sign-out.
- [ ] Require sign-in for posting and personal goals.
- [ ] Verify signed-in and signed-out flows.
```

### Connect Find food and Place details to listings

```markdown
## Description

Use saved food listings in both the browse and detail views.

## Tasks

- [ ] Load listings in Find food.
- [ ] Open the corresponding listing from each result.
- [ ] Handle empty results and missing listings.
```

### Let signed-in students publish community posts

```markdown
## Description

Let signed-in students share food finds in the Community feed.

## Tasks

- [ ] Create a post form and validate required fields.
- [ ] Save the post with its author.
- [ ] Verify the post appears after a reload.
```

### Let signed-in students mark posts as helpful

```markdown
## Description

Let students mark and unmark community posts as helpful.

## Tasks

- [ ] Allow one helpful vote per account per post.
- [ ] Update the displayed count when a vote changes.
- [ ] Verify vote state survives a reload.
```

### Save personal meal goals

```markdown
## Description

Save meal goals to each student’s account.

## Tasks

- [ ] Save budget, nutrition, dietary, and travel preferences.
- [ ] Reload the saved preferences in My goals.
- [ ] Verify one account cannot access another account’s goals.
```

### Verify and deploy M2 and refresh project screenshots

```markdown
## Description

Publish and check the second milestone release.

## Tasks

- [ ] Verify sign-in, listings, posting, helpful votes, and goals.
- [ ] Deploy M2 and smoke-test the production site.
- [ ] Refresh the project home screenshots.
```
