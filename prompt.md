You are modifying the Promptys project.

IMPORTANT SECURITY RULE:
Work ONLY inside this project directory:
 /Users/tt/Prompty

Do not access, inspect, modify, create, or delete anything outside that directory.

Before making any changes, inspect the existing project files and understand how the current sidebar, page creation, prompt-template.js, page storage, and page loading systems work.

CURRENT PROJECT STRUCTURE AND GOAL:

The Promptys application has a sidebar.

When the user clicks the existing "+" button in the sidebar, a new page is created using the existing prompt template from:

prompt-template.js

The current prompt template has this structure:

<section class="prompts-page">
    <h2>New prompts Template Page</h2>

    <div class="prompts-container">
        <div class="prompt">
            <div class="prompt-txt">
                <h4>Prompt Template</h4>
                <p></p>
            </div>

            <div class="prompt-img">
            </div>
        </div>
    </div>
</section>

TASK:

Modify the Promptys project so that every newly created prompts page has a "+" button directly below the <h2> title and above the .prompts-container.

The structure should conceptually become:

<section class="prompts-page">
    <h2>New prompts Template Page</h2>

    <button class="add-prompt-btn" type="button">+</button>

    <div class="prompts-container">
        <div class="prompt">
            ...
        </div>
    </div>
</section>

When the user clicks this "+" button:

1. Create a new .prompt element using the existing .prompt structure as the template.

2. Append the newly created .prompt to that page's .prompts-container.

3. Do NOT create another prompts page.

4. Do NOT modify the sidebar.

5. Do NOT reload the entire application just to add a prompt.

6. The new prompt should immediately appear on the current prompts page.

PERSISTENCE:

The newly created prompts must be saved.

If the user creates several prompts on a prompts page, those prompts must still exist after the application is reloaded.

Use the application's existing localStorage/page-storage architecture where appropriate.

Do not introduce a second unrelated storage system if the existing architecture can reasonably support this.

The existing sidebar page itself must continue to work exactly as it currently does.

IMPORTANT EXISTING FUNCTIONALITY:

Do not break:

- sidebar page creation
- sidebar page deletion
- sidebar edit mode
- loading static HTML pages
- loading user-created pages
- localStorage page persistence
- keyboard navigation
- existing prompt/step styling
- existing page loading behavior

Do not unnecessarily rewrite unrelated files.

Before modifying anything, inspect the relevant existing JavaScript and template files.

Determine the smallest clean architecture that fits the existing application.

If JavaScript currently loads page HTML dynamically, account for the fact that event listeners may need to be attached after the page is injected into .main-landing-page.

Do not duplicate event listeners when a page is loaded more than once.

Use event delegation where it makes sense.

The existing .prompt structure is the template for a single prompt. Preserve its existing classes and structure.

Do not rename existing classes unless absolutely necessary.

If CSS changes are required for the new button, make only the minimal CSS changes necessary.

After implementing the feature, inspect the resulting code for errors and make sure the existing application behavior is preserved.

IMPORTANT:
Do not merely explain what should be changed.

Actually implement the requested changes.

Return a concise summary of:
- files changed
- what was changed
- how prompt persistence works
- any assumptions made