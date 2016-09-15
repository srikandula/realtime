package com.pwc.adc.realtime.web.rest;

import com.pwc.adc.realtime.RealtimeApp;

import com.pwc.adc.realtime.domain.Checklist_template;
import com.pwc.adc.realtime.repository.Checklist_templateRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the Checklist_templateResource REST controller.
 *
 * @see Checklist_templateResource
 */
@RunWith(SpringRunner.class)

@SpringBootTest(classes = RealtimeApp.class)

public class Checklist_templateResourceIntTest {
    private static final String DEFAULT_QUESTION = "AAAAA";
    private static final String UPDATED_QUESTION = "BBBBB";
    private static final String DEFAULT_DESCRIPTION = "AAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBB";

    @Inject
    private Checklist_templateRepository checklist_templateRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Inject
    private EntityManager em;

    private MockMvc restChecklist_templateMockMvc;

    private Checklist_template checklist_template;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        Checklist_templateResource checklist_templateResource = new Checklist_templateResource();
        ReflectionTestUtils.setField(checklist_templateResource, "checklist_templateRepository", checklist_templateRepository);
        this.restChecklist_templateMockMvc = MockMvcBuilders.standaloneSetup(checklist_templateResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Checklist_template createEntity(EntityManager em) {
        Checklist_template checklist_template = new Checklist_template()
                .question(DEFAULT_QUESTION)
                .description(DEFAULT_DESCRIPTION);
        return checklist_template;
    }

    @Before
    public void initTest() {
        checklist_template = createEntity(em);
    }

    @Test
    @Transactional
    public void createChecklist_template() throws Exception {
        int databaseSizeBeforeCreate = checklist_templateRepository.findAll().size();

        // Create the Checklist_template

        restChecklist_templateMockMvc.perform(post("/api/checklist-templates")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(checklist_template)))
                .andExpect(status().isCreated());

        // Validate the Checklist_template in the database
        List<Checklist_template> checklist_templates = checklist_templateRepository.findAll();
        assertThat(checklist_templates).hasSize(databaseSizeBeforeCreate + 1);
        Checklist_template testChecklist_template = checklist_templates.get(checklist_templates.size() - 1);
        assertThat(testChecklist_template.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testChecklist_template.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void getAllChecklist_templates() throws Exception {
        // Initialize the database
        checklist_templateRepository.saveAndFlush(checklist_template);

        // Get all the checklist_templates
        restChecklist_templateMockMvc.perform(get("/api/checklist-templates?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.[*].id").value(hasItem(checklist_template.getId().intValue())))
                .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getChecklist_template() throws Exception {
        // Initialize the database
        checklist_templateRepository.saveAndFlush(checklist_template);

        // Get the checklist_template
        restChecklist_templateMockMvc.perform(get("/api/checklist-templates/{id}", checklist_template.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(checklist_template.getId().intValue()))
            .andExpect(jsonPath("$.question").value(DEFAULT_QUESTION.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingChecklist_template() throws Exception {
        // Get the checklist_template
        restChecklist_templateMockMvc.perform(get("/api/checklist-templates/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChecklist_template() throws Exception {
        // Initialize the database
        checklist_templateRepository.saveAndFlush(checklist_template);
        int databaseSizeBeforeUpdate = checklist_templateRepository.findAll().size();

        // Update the checklist_template
        Checklist_template updatedChecklist_template = checklist_templateRepository.findOne(checklist_template.getId());
        updatedChecklist_template
                .question(UPDATED_QUESTION)
                .description(UPDATED_DESCRIPTION);

        restChecklist_templateMockMvc.perform(put("/api/checklist-templates")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedChecklist_template)))
                .andExpect(status().isOk());

        // Validate the Checklist_template in the database
        List<Checklist_template> checklist_templates = checklist_templateRepository.findAll();
        assertThat(checklist_templates).hasSize(databaseSizeBeforeUpdate);
        Checklist_template testChecklist_template = checklist_templates.get(checklist_templates.size() - 1);
        assertThat(testChecklist_template.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testChecklist_template.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void deleteChecklist_template() throws Exception {
        // Initialize the database
        checklist_templateRepository.saveAndFlush(checklist_template);
        int databaseSizeBeforeDelete = checklist_templateRepository.findAll().size();

        // Get the checklist_template
        restChecklist_templateMockMvc.perform(delete("/api/checklist-templates/{id}", checklist_template.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Checklist_template> checklist_templates = checklist_templateRepository.findAll();
        assertThat(checklist_templates).hasSize(databaseSizeBeforeDelete - 1);
    }
}
