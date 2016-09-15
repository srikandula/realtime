package com.pwc.adc.realtime.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.pwc.adc.realtime.domain.Checklist_template;

import com.pwc.adc.realtime.repository.Checklist_templateRepository;
import com.pwc.adc.realtime.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Checklist_template.
 */
@RestController
@RequestMapping("/api")
public class Checklist_templateResource {

    private final Logger log = LoggerFactory.getLogger(Checklist_templateResource.class);
        
    @Inject
    private Checklist_templateRepository checklist_templateRepository;

    /**
     * POST  /checklist-templates : Create a new checklist_template.
     *
     * @param checklist_template the checklist_template to create
     * @return the ResponseEntity with status 201 (Created) and with body the new checklist_template, or with status 400 (Bad Request) if the checklist_template has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/checklist-templates",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Checklist_template> createChecklist_template(@RequestBody Checklist_template checklist_template) throws URISyntaxException {
        log.debug("REST request to save Checklist_template : {}", checklist_template);
        if (checklist_template.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("checklist_template", "idexists", "A new checklist_template cannot already have an ID")).body(null);
        }
        Checklist_template result = checklist_templateRepository.save(checklist_template);
        return ResponseEntity.created(new URI("/api/checklist-templates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("checklist_template", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /checklist-templates : Updates an existing checklist_template.
     *
     * @param checklist_template the checklist_template to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated checklist_template,
     * or with status 400 (Bad Request) if the checklist_template is not valid,
     * or with status 500 (Internal Server Error) if the checklist_template couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/checklist-templates",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Checklist_template> updateChecklist_template(@RequestBody Checklist_template checklist_template) throws URISyntaxException {
        log.debug("REST request to update Checklist_template : {}", checklist_template);
        if (checklist_template.getId() == null) {
            return createChecklist_template(checklist_template);
        }
        Checklist_template result = checklist_templateRepository.save(checklist_template);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("checklist_template", checklist_template.getId().toString()))
            .body(result);
    }

    /**
     * GET  /checklist-templates : get all the checklist_templates.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of checklist_templates in body
     */
    @RequestMapping(value = "/checklist-templates",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Checklist_template> getAllChecklist_templates() {
        log.debug("REST request to get all Checklist_templates");
        List<Checklist_template> checklist_templates = checklist_templateRepository.findAll();
        return checklist_templates;
    }

    /**
     * GET  /checklist-templates/:id : get the "id" checklist_template.
     *
     * @param id the id of the checklist_template to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the checklist_template, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/checklist-templates/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Checklist_template> getChecklist_template(@PathVariable Long id) {
        log.debug("REST request to get Checklist_template : {}", id);
        Checklist_template checklist_template = checklist_templateRepository.findOne(id);
        return Optional.ofNullable(checklist_template)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /checklist-templates/:id : delete the "id" checklist_template.
     *
     * @param id the id of the checklist_template to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/checklist-templates/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteChecklist_template(@PathVariable Long id) {
        log.debug("REST request to delete Checklist_template : {}", id);
        checklist_templateRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("checklist_template", id.toString())).build();
    }

}
